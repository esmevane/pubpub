import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getJSON } from '@pubpub/editor';

import { GridWrapper } from 'components';
import { usePageContext } from 'utils/hooks';
import { useSticky } from 'utils/useSticky';

import { getTocHeadings } from './headerUtils';
import PubDetails from './details';
import PubHeaderBackground from './PubHeaderBackground';
import PubHeaderContent from './PubHeaderContent';
import SmallHeaderButton from './SmallHeaderButton';
import PubHeaderSticky from './PubHeaderSticky';

const getPubHeadings = (pubData, collabData) => {
	let docJson = pubData.initialDoc;
	if (collabData.editorChangeObject && collabData.editorChangeObject.view) {
		docJson = getJSON(collabData.editorChangeObject.view);
	}
	return docJson ? getTocHeadings(docJson) : [];
};

require('./pubHeader.scss');

const propTypes = {
	collabData: PropTypes.object.isRequired,
	historyData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	updateLocalData: PropTypes.func.isRequired,
	sticky: PropTypes.bool,
};

const defaultProps = {
	sticky: true,
};

// eslint-disable-next-line react/prop-types
const ToggleDetailsButton = ({ showingDetails, onClick }) => {
	const label = showingDetails ? 'Hide details' : 'Show details';
	const icon = showingDetails ? 'cross' : 'expand-all';
	return (
		<SmallHeaderButton
			className={classNames('details-button', showingDetails && 'showing-details')}
			label={label}
			labelPosition="left"
			icon={icon}
			onClick={onClick}
		/>
	);
};

const PubHeader = (props) => {
	const headerRef = useRef(null);
	const { collabData, historyData, pubData, updateLocalData, sticky } = props;
	const { communityData } = usePageContext();
	const [showingDetails, setShowingDetails] = useState(false);
	const [fixedHeight, setFixedHeight] = useState(null);
	const pubHeadings = getPubHeadings(pubData, collabData);

	useSticky({
		isActive: sticky && headerRef.current,
		selector: '.pub-header-component',
		offset: headerRef.current ? 37 - headerRef.current.offsetHeight : 0,
	});

	const toggleDetails = () => {
		if (!showingDetails && headerRef.current) {
			const boundingRect = headerRef.current.getBoundingClientRect();
			setFixedHeight(boundingRect.height);
		}
		setShowingDetails(!showingDetails);
	};

	return (
		<PubHeaderBackground
			className={classNames('pub-header-component', showingDetails && 'showing-details')}
			pubData={pubData}
			communityData={communityData}
			ref={headerRef}
			style={fixedHeight && showingDetails ? { height: fixedHeight } : {}}
			safetyLayer={showingDetails ? 'full-height' : 'enabled'}
		>
			<GridWrapper containerClassName="pub" columnClassName="pub-header-column">
				{!showingDetails && (
					<PubHeaderContent
						pubData={pubData}
						updateLocalData={updateLocalData}
						historyData={historyData}
						pubHeadings={pubHeadings}
					/>
				)}
				{showingDetails && <PubDetails pubData={pubData} communityData={communityData} />}
				<ToggleDetailsButton showingDetails={showingDetails} onClick={toggleDetails} />
			</GridWrapper>
			<PubHeaderSticky pubData={pubData} collabData={collabData} pubHeadings={pubHeadings} />
		</PubHeaderBackground>
	);
};

PubHeader.propTypes = propTypes;
PubHeader.defaultProps = defaultProps;
export default PubHeader;
