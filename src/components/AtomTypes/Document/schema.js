import {Schema, Inline, Text, Attribute} from 'prosemirror/dist/model';
import {Doc, BlockQuote, OrderedList, BulletList, ListItem, HorizontalRule, Heading, CodeBlock, Paragraph, Image, HardBreak, EmMark, StrongMark, LinkMark, CodeMark} from 'prosemirror/dist/schema-basic';
import React from 'react';
import ReactDOM from 'react-dom';
import EmbedWrapper from './EmbedWrapper';

// An Emoji node type.
class Emoji extends Inline {
  get attrs() {
	return {
		content: new Attribute,
		markup: new Attribute,
	};
  }
  toDOM(node) { return ['span', node.attrs.content]; }
}

// ;; An inline embed node type. Has these attributes:
//
// - **`src`** (required): The slug of the pub.
// - **`className`**: An optional className for styling.
// - **`id`**: An option id for styling to linking.
// - **`align`**: inline, left, right, or full
// - **`size`**: CSS valid width
// - **`caption`**: String caption to place under the embed
// - **`data`**: Cached version/atom data. This is not serialized into markdown, but is kept here for fast rendering
class Embed extends Inline {
	get attrs() {
		return {
			source: new Attribute,
			className: new Attribute({default: ''}),
			id: new Attribute({default: ''}),
			align: new Attribute({default: 'full'}),
			size: new Attribute({default: '70%'}),
			caption: new Attribute({default: ''}),
			data: new Attribute({default: {}})
		};
	}
	get draggable() { return true; }
	toDOM(node) { 
		const dom = document.createElement('div');
		ReactDOM.render(<EmbedWrapper {...node.attrs}/>, dom);
		return dom.childNodes[0];
	}
}

exports.Embed = Embed;

export const schema = new Schema({
	nodes: {
		doc: {type: Doc, content: 'block+'},

		paragraph: {type: Paragraph, content: 'inline<_>*', group: 'block'},
		blockquote: {type: BlockQuote, content: 'block+', group: 'block'},
		ordered_list: {type: OrderedList, content: 'list_item+', group: 'block'},
		bullet_list: {type: BulletList, content: 'list_item+', group: 'block'},
		horizontal_rule: {type: HorizontalRule, group: 'block'},
		heading: {type: Heading, content: 'inline<_>*', group: 'block'},
		code_block: {type: CodeBlock, content: 'text*', group: 'block'},

		list_item: {type: ListItem, content: 'paragraph block*'},

		text: {type: Text, group: 'inline'},
		emoji: {type: Emoji, group: 'inline'},
		image: {type: Image, group: 'inline'},
		embed: {type: Embed, group: 'inline'},
		hard_break: {type: HardBreak, group: 'inline'}
	},
	marks: {
		em: EmMark,
		strong: StrongMark,
		link: LinkMark,
		code: CodeMark
	}
});
