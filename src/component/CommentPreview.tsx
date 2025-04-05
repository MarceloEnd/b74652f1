import React, { useEffect, useState } from "react";
import { CommentType } from "../model/CommentPost";
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeComment } from "../store/reducer/CommentReducer";
import { AddChildComment } from "./AddChildComment";
import { ChildPreview } from "./ChildPreview";
import { createCommentsIndexedDB, removeCommentFromIndexedDB } from "../hooks/db";

export const CommentPreview: React.FC<CommentType> = (props: CommentType) => {
    const {description, id, children } = props;
    const dispatch = useDispatch();
    // used for IndexedDB 
    const [db, setDb] = useState<IDBDatabase | null>(null);
    
    useEffect(() => {
        async function initializeDB() {
            const database = await createCommentsIndexedDB('commentsDB', 'commentsStore');
            setDb(database);
        }
    
        initializeDB();
    }, []);
    

    const handleRemoveComment = async () => {
        if (db) {
            try {
                await removeCommentFromIndexedDB(db, 'commentsStore', id);
                dispatch(removeComment(id));
            } catch (error) {
                console.error('Error removing comment:', error);
            }
        }
    };

    return (
        <Card sx={{ width: 500, marginBottom: '4px' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div">{description}</Typography>
                    <IconButton data-testid="clear-test-button" onClick={() => handleRemoveComment()}>
                        <ClearIcon />
                    </IconButton>
                </Box>
                <AddChildComment {...props} />
                {children &&
                    <>
                        {children.map((child, index) => (
                            <ChildPreview key={index} {...child} />
                        ))}
                    </>
                }

            </CardContent>
        </Card>
    );
};

