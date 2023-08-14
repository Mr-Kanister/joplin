import * as React from 'react';
import { useCallback, forwardRef, LegacyRef, ChangeEvent, CSSProperties, MouseEventHandler, DragEventHandler, useMemo } from 'react';
import { OnChangeHandler } from '../NoteList/utils/types';
import { Size } from '@joplin/utils/types';
import useRootElement from './utils/useRootElement';
import useItemElement from './utils/useItemElement';
import useItemEventHandlers from './utils/useItemEventHandlers';
import { OnCheckboxChange } from './utils/types';

interface NoteItemProps {
	dragIndex: number;
	highlightedWords: string[];
	index: number;
	isProvisional: boolean;
	itemSize: Size;
	noteCount: number;
	noteHtml: string;
	noteId: string;
	onChange: OnChangeHandler;
	onClick: MouseEventHandler<HTMLDivElement>;
	onContextMenu: MouseEventHandler;
	onDragOver: DragEventHandler;
	onDragStart: DragEventHandler;
	style: CSSProperties;
}

const NoteListItem = (props: NoteItemProps, ref: LegacyRef<HTMLDivElement>) => {
	const elementId = `list-note-${props.noteId}`;
	const idPrefix = 'user-note-list-item-';

	const onCheckboxChange: OnCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const internalId: string = event.currentTarget.getAttribute('id');
		const userId = internalId.substring(idPrefix.length);
		void props.onChange({ noteId: props.noteId }, userId, { value: event.currentTarget.checked });
	}, [props.onChange, props.noteId]);

	const rootElement = useRootElement(elementId);

	const itemElement = useItemElement(
		rootElement,
		props.noteId,
		props.noteHtml,
		props.style,
		props.itemSize,
		props.onClick
	);

	useItemEventHandlers(rootElement, itemElement, idPrefix, onCheckboxChange);

	const style = useMemo(() => {
		let dragItemPosition = '';
		if (props.dragIndex === props.index) {
			dragItemPosition = 'top';
		} else if (props.index === props.noteCount - 1 && props.dragIndex >= props.noteCount) {
			dragItemPosition = 'bottom';
		}

		return {
			borderTopWidth: dragItemPosition === 'top' ? '2px' : 0,
			borderBottomWidth: dragItemPosition === 'bottom' ? '2px' : 0,
		};
	}, [props.dragIndex, props.index, props.noteCount]);

	const className = useMemo(() => {
		return [
			'note-list-item-wrapper',

			// This is not used by the app, but kept here because it may be used
			// by users for custom CSS.
			(props.index + 1) % 2 === 0 ? 'even' : 'odd',

			props.isProvisional && '-provisional',
		].filter(e => !!e).join(' ');
	}, [props.index, props.isProvisional]);

	return <div
		id={elementId}
		ref={ref}
		tabIndex={0}
		style={style}
		className={className}
		data-id={props.noteId}
		onContextMenu={props.onContextMenu}
		onDragStart={props.onDragStart}
		onDragOver={props.onDragOver}
	></div>;
};

export default forwardRef(NoteListItem);