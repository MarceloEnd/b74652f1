import { CommentType } from "../model/CommentPost";

export async function createCommentsIndexedDB(dbName: string, storeName: string): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event);
            reject(event);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };
    });
}

export async function addCommentToIndexedDB(db: IDBDatabase, storeName: string, comment: CommentType): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(comment);

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            reject(false);
        };
    });
}

export async function getAllComments(dbName: string, storeName: string): Promise<CommentType[]> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = (event) => reject(`IndexedDB error: ${event}`);

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = (getAllEvent) => {
                resolve((getAllEvent.target as IDBRequest<CommentType[]>).result);
            };

            getAllRequest.onerror = (getAllEvent) => reject(`Error getting all comments: ${getAllEvent}`);
        };
    });
}

export async function addChildCommentToIndexedDB(db: IDBDatabase, storeName: string, parentId: number, childComment: CommentType): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const parent = await getCommentFromIndexedDB(db, storeName, parentId);
            if (parent) {
                const updatedParent = {
                    ...parent,
                    children: parent.children ? [...parent.children, childComment] : [childComment],
                };
                await updateCommentInIndexedDB(db, storeName, updatedParent);
                resolve();
            } else {
                reject(new Error(`Parent comment with id ${parentId} not found.`));
            }
        } catch (error) {
            console.error('Error adding child comment:', error);
            reject(error);
        }
    });
}

export async function getCommentFromIndexedDB(db: IDBDatabase, storeName: string, id: number): Promise<CommentType | undefined> {
    return new Promise<CommentType | undefined>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest<CommentType>).result);
        };

        request.onerror = (event) => {
            reject(false);
        };
    });
}

export async function updateCommentInIndexedDB(db: IDBDatabase, storeName: string, comment: CommentType): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(comment);

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            reject(false);
        };
    });
}

export async function removeCommentFromIndexedDB(db: IDBDatabase, storeName: string, commentId: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const allComments = await getAllComments('commentsDB', 'commentsStore');
            const updatedComments = removeCommentRecursive(allComments, commentId);

            // Clear the object store and re-add all comments
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            store.clear();

            for (const comment of updatedComments) {
                await addCommentToIndexedDB(db, storeName, comment);
            }

            resolve();
        } catch (error) {
            console.error('Error removing comment:', error);
            reject(error);
        }
    });
}

function removeCommentRecursive(comments: CommentType[], commentId: number): CommentType[] {
    return comments.filter((comment) => {
        if (comment.id === commentId) {
            return false;
        }
        if (comment.children) {
            comment.children = removeCommentRecursive(comment.children, commentId);
        }
        return true;
    });
}
