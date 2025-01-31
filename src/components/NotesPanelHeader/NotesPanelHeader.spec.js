import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { Basic } from './NotesPanelHeader.stories';
import NotesPanelHeader from './NotesPanelHeader';
import DataElements from 'constants/dataElement';

const BasicStory = withI18n(Basic);

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const initialState = {
  viewer: {
    customElementOverrides: {}, // Need to define customElementOverrides otherwise component will fail to render.
    disabledElements: {},
    isNotesPanelMultiSelectEnabled: true,
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    },
  },
  officeEditor: {},
  featureFlags: {
    customizableUI: false,
  }
};

describe('NotesPanelHeader', () => {
  describe('Storybook Component', () => {
    it('Basic story should not throw any errors', () => {
      expect(() => {
        render(<BasicStory />);
      }).not.toThrow();
    });
  });

  describe('UI Tests', () => {
    beforeEach(() => {
      initialState.viewer.disabledElements = {};
    });

    it('Should render all sections of NotesPanelHeader', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByPlaceholderText('Search comments');
      screen.getByText('Sort:');
      screen.getByText('Comments (0)');
    });

    it('Should not render NotesPanelHeader if disabled', () => {
      initialState.viewer.disabledElements['notesPanelHeader'] = { disabled: true };
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      expect(screen.queryByPlaceholderText('Search comments')).not.toBeInTheDocument;
      expect(screen.queryByText('Sort:')).not.toBeInTheDocument;
      expect(screen.queryByText('Comments (0)')).not.toBeInTheDocument;
    });

    it('Should not render search input if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.INPUT_CONTAINER
      ] = { disabled: true };

      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      expect(screen.queryByPlaceholderText('Search comments')).not.toBeInTheDocument();
      screen.getByText('Sort:');
      screen.getByText('Comments (0)');
    });

    it('Should not render comments counter if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.COMMENTS_COUNTER
      ] = { disabled: true };

      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByPlaceholderText('Search comments');
      screen.getByText('Sort:');
      expect(screen.queryByText('Comments (0)')).not.toBeInTheDocument;
    });

    it('Should not render sorting row if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.SORT_ROW
      ] = { disabled: true };
      initialState.viewer.isNotesPanelMultiSelectEnabled = true;
      const store = configureStore({ reducer: () => initialState });
      const { container } = render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={false}
            disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByPlaceholderText('Search comments');
      expect(screen.queryByText('Sort:')).not.toBeInTheDocument();
      screen.getByText('Comments (0)');
    });

    it('Should have Aria Label on the dropdown', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      const element = screen.getByText('Sort:');
      expect(element).toBeInTheDocument();
    });

    it('Should have h2 on header', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      const element = screen.getByText('Comments (0)');
      expect(element.tagName.toLocaleLowerCase()).toEqual('h2');
    });

    it('Should have aria-pressed labels', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <BasicStory />
        </Provider>
      );

      const element = screen.queryByRole('button', { name: 'Filter' });
      expect(element.getAttribute('aria-pressed')).toBe('false');
    });
  });
});
