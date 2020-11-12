import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Byline } from 'components';
import { usePageContext } from 'utils/hooks';
import { formatDate } from 'utils/dates';
import { pubUrl, pubShortUrl } from 'utils/canonicalUrls';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { getAllPubContributors } from 'utils/contributors';

import { getHostnameForUrl } from './util';
import PubEdgeLayout from './PubEdgeLayout';
import PubEdgeDescriptionButton from './PubEdgeDescriptionButton';

require('./pubEdge.scss');

export type PubEdgeProps = {
	accentColor?: string;
	actsLikeLink?: boolean;
	pubEdge: any;
	viewingFromTarget?: boolean;
	showDescriptionByDefault?: boolean;
};

const getUrlForPub = (pubData, communityData) => {
	if (communityData.id === pubData.communityId) {
		return pubUrl(communityData, pubData);
	}
	if (pubData.community) {
		return pubUrl(pubData.communityId, pubData);
	}
	return pubShortUrl(pubData);
};

const getValuesFromPubEdge = (pubEdge, communityData, viewingFromTarget) => {
	const { externalPublication, targetPub, pub } = pubEdge;
	const displayedPub = viewingFromTarget ? pub : targetPub;
	if (displayedPub) {
		const { title, description, avatar } = displayedPub;
		const url = getUrlForPub(displayedPub, communityData);
		const publishedDate = getPubPublishedDate(displayedPub);
		return {
			avatar: avatar,
			contributors: getAllPubContributors(displayedPub, false, true),
			description: description,
			publishedAt: publishedDate && formatDate(publishedDate),
			title: title,
			url: url,
		};
	}
	if (externalPublication) {
		const {
			title,
			description,
			contributors,
			avatar,
			url,
			publicationDate,
		} = externalPublication;
		return {
			avatar: avatar,
			contributors: contributors || '',
			description: description,
			publishedAt: publicationDate && formatDate(publicationDate, { inUtcTime: true }),
			title: title,
			url: url,
		};
	}
	return {};
};

const PubEdge = (props: PubEdgeProps) => {
	const {
		actsLikeLink = false,
		pubEdge,
		viewingFromTarget = false,
		showDescriptionByDefault = false,
	} = props;
	const [open, setOpen] = useState(showDescriptionByDefault);
	const { communityData } = usePageContext();
	const { avatar, contributors, description, publishedAt, title, url } = getValuesFromPubEdge(
		pubEdge,
		communityData,
		viewingFromTarget,
	);

	const detailsElementId = `edge-details-${pubEdge.id}`;

	const handleToggleDescriptionClick = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			if (e.type === 'click' || ('key' in e && e.key === 'Enter')) {
				e.preventDefault();
				e.stopPropagation();
				setOpen(!open);
			}
		},
		[open],
	);

	const maybeLink = (element, restProps = {}) => {
		if (actsLikeLink) {
			return (
				<span className="link" {...restProps}>
					{element}
				</span>
			);
		}

		return (
			<a href={url} {...restProps}>
				{element}
			</a>
		);
	};

	const maybeWrapWithLink = (element, restProps = {}) => {
		if (actsLikeLink) {
			return (
				<a href={url} {...restProps}>
					{element}
				</a>
			);
		}
		return <div {...restProps}>{element}</div>;
	};

	useEffect(() => setOpen(showDescriptionByDefault), [showDescriptionByDefault]);

	return maybeWrapWithLink(
		<PubEdgeLayout
			topLeftElement={maybeLink(avatar && <img src={avatar} alt={title} />, {
				tabIndex: '-1',
			})}
			titleElement={maybeLink(title)}
			bylineElement={contributors.length > 0 && <Byline contributors={contributors} />}
			metadataElements={[
				description && (
					<PubEdgeDescriptionButton
						onToggle={handleToggleDescriptionClick}
						open={open}
						targetId={detailsElementId}
					/>
				),
				publishedAt && <>Published on {publishedAt}</>,
				<span className="location">{getHostnameForUrl(url)}</span>,
			]}
			detailsElement={
				<details open={open} id={detailsElementId}>
					<summary>Description</summary>
					<hr />
					<p>{description}</p>
				</details>
			}
		/>,
		{ className: classNames('pub-edge-component', actsLikeLink && 'acts-like-link') },
	);
};

export default PubEdge;
