
    

import { Box } from "@mui/material";
import { CommentPreview } from "../component/CommentPreview";
import { CommentState } from "../store/reducer/CommentReducer";
import { useSelector } from "react-redux";
import { createCommentsIndexedDB, getAllComments } from "../hooks/db";
import { useEffect, useState } from "react";
import { CommentType } from "../model/CommentPost";

interface RootState {
    comments: CommentState;
}

export const ShowComments = () => {
    const comments = useSelector((state: RootState) => state.comments.comments);
    // used for IndexedDB 
    const [indexedDBComments, setIndexedDBComments] = useState<CommentType[]>([]);
    const db = createCommentsIndexedDB('commentsDB', 'commentsStore');

    useEffect(() => {
        async function fetchComments() {
            try {
                const commentsFromDB = await getAllComments('commentsDB', 'commentsStore');
                setIndexedDBComments(commentsFromDB);
            } catch (error) {
                console.error("Error fetching comments from IndexedDB:", error);
            }
        }

        fetchComments();
    }, [db]);

    const commentsToDisplay = indexedDBComments;

    return (
        <Box
            sx={{width: '100%',display: 'grid', placeItems: 'center',}}>
            <h2>Comments</h2>
            {commentsToDisplay.map((comment, index) => (
                <CommentPreview key={index} {...comment} />
            )
            )}
        </Box>
    );

};

