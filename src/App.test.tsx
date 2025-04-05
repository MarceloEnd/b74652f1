import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'; 
import { AddComment } from './component/AddComment';
import { CommentReducer } from './store/reducer/CommentReducer';
import { ShowComments } from './component/ShowComments';

describe('Testing all components', () => {
  it('render the component', () => {
    const store = configureStore({
      reducer: {
        comments: CommentReducer,
      },
    });

    render(
      <Provider store={store}>
        <AddComment />
      </Provider>
    );

    expect(screen.getByText('New Comment')).toBeInTheDocument();
  });

  it('should dispatch addComment action when Save button is clicked', () => {
    const store = configureStore({
      reducer: {
        comments: CommentReducer,
      },
    });

    render(
      <Provider store={store}>
        <AddComment />
      </Provider>
    );

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'First test comment' } });
    fireEvent.click(screen.getByText('Save'));

    const comments = store.getState().comments.comments;
    expect(comments).toEqual(expect.arrayContaining([
      {
        description: 'First test comment',
        id: expect.any(Number),
      },
    ]));
  });

  it('clear the inputfield after dispatching addComment', () => {
    const store = configureStore({
      reducer: {
        comments: CommentReducer,
      },
    });

    render(
      <Provider store={store}>
        <AddComment />
      </Provider>
    );

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'First test comment' } });
    fireEvent.click(screen.getByText('Save'));

    expect(descriptionInput).toHaveValue('');
  });

  it('removeComment after dispatching addComment', () => {
    const store = configureStore({
      reducer: {
        comments: CommentReducer,
      },
    });

    render(
      <Provider store={store}>
        <AddComment />
        <ShowComments />
      </Provider>
    );

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'First test comment' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('First test comment')).toBeInTheDocument();
    const comments = store.getState().comments.comments;
    expect(comments).toEqual(expect.arrayContaining([
      {
        description: 'First test comment',
        id: expect.any(Number),
      },
    ]));

    const deleteButton = screen.getByTestId('clear-test-button');
    fireEvent.click(deleteButton);
    expect(comments).toEqual(expect.arrayContaining([]));
  });

  it('should dispatch addCommentChildren action when children Save button is clicked', () => {
    const store = configureStore({
      reducer: {
        comments: CommentReducer,
      },
    });

    render(
      <Provider store={store}>
        <AddComment />
        <ShowComments />
      </Provider>
    );

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Parent test comment' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Parent test comment')).toBeInTheDocument();

    const childDescriptionInput = screen.getByLabelText('Description2');
    fireEvent.change(childDescriptionInput, { target: { value: 'Child test comment' } });
    fireEvent.click(screen.getByTestId('child-button'));
    const commentsInChildren = store.getState().comments.comments;
    expect(commentsInChildren).toEqual(expect.arrayContaining([
      {
        description: 'Parent test comment',
        id: expect.any(Number),
        children: [{
          description: 'Child test comment',
          id: expect.any(Number),
        }]
      },
    ]));
  });
  it('should dispatch removeChildrenComment after addCommentChildren', () => {
    const store = configureStore({
      reducer: {
        comments: CommentReducer,
      },
    });

    render(
      <Provider store={store}>
        <AddComment />
        <ShowComments />
      </Provider>
    );

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Parent test comment' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Parent test comment')).toBeInTheDocument();

    const childDescriptionInput = screen.getByLabelText('Description2');
    fireEvent.change(childDescriptionInput, { target: { value: 'Child test comment' } });
    fireEvent.click(screen.getByTestId('child-button'));
    
    const deleteButton = screen.getByTestId('clear-child-test-button');
    fireEvent.click(deleteButton);

    const commentsInChildren = store.getState().comments.comments;
    expect(commentsInChildren).toEqual(expect.arrayContaining([
      {
        description: 'Parent test comment',
        id: expect.any(Number),
        children: []
      },
    ]));

  });

});