import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsDetails from 'components/PubOptionsDetails/PubOptionsDetails';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components', module)
.add('PubOptionsDetails', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsDetails
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
