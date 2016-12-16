import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Menu, MenuDivider } from '@blueprintjs/core';
import { PreviewUser, PreviewPub, DropdownButton } from 'components';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const UserFollowing = React.createClass({
	propTypes: {
		user: PropTypes.object,
		ownProfile: PropTypes.bool,
		pathname: PropTypes.string, 
		query: PropTypes.object,
	},

	sortList: function(list) {
		return list.sort((foo, bar)=> {
			const query = this.props.query;

			const fooTitle = foo.firstName || foo.name || foo.title || ''
			const barTitle = bar.firstName || bar.name || bar.title || ''

			const fooFollowObject = foo.FollowsJournal || foo.FollowsPub || foo.FollowsPub || foo.FollowsLabel || {};
			const barFollowObject = bar.FollowsJournal || bar.FollowsPub || bar.FollowsPub || bar.FollowsLabel || {};
			
			const fooDate = fooFollowObject.createdAt;
			const barDate = barFollowObject.createdAt;

			const newest = query.sort === 'Most Recently Followed';
			const oldest = query.sort === 'Least Recently Followed';

			const aToZ = query.sort === 'A → Z';
			const zToA = query.sort === 'Z → A';

			if (newest && fooDate > barDate) { return -1; }
			if (newest && fooDate < barDate) { return 1; }

			if (oldest && fooDate > barDate) { return 1; }
			if (oldest && fooDate < barDate) { return -1; }

			if (aToZ && fooTitle > barTitle) { return 1; }
			if (aToZ && fooTitle < barTitle) { return -1; }

			if (zToA && fooTitle > barTitle) { return -1; }
			if (zToA && fooTitle < barTitle) { return 1; }

			return 0;
		});
	},

	render() {
		const user = this.props.user || {};
		const followsUsers = user.followsUsers || [];
		const followsPubs = user.followsPubs || [];
		const followsJournals = user.followsJournals || [];
		const followsLabels = user.followsLabels || [];
		const query = this.props.query || {};
		const mode = query.mode;

		const sortList = ['Most Recently Followed', 'Least Recently Followed', 'A → Z', 'Z → A'];

		return (
			<div style={styles.container}>
				
				<div style={styles.headerWrapper}>
					<div style={styles.headerTitle}>
						<h2 style={styles.header}>Following</h2>
					</div>
					<div style={styles.headerOptions}>
						<div className="pt-button-group pt-minimal">
							<Link to={{ pathname: this.props.pathname, query: { ...query, mode: undefined } }} className={mode === undefined || mode === 'pubs' ? 'pt-button pt-active' : 'pt-button'}>Pubs</Link>
							<Link to={{ pathname: this.props.pathname, query: { ...query, mode: 'users' } }} className={mode === 'users' ? 'pt-button pt-active' : 'pt-button'}>Users</Link>
							<Link to={{ pathname: this.props.pathname, query: { ...query, mode: 'journals' } }} className={mode === 'journals' ? 'pt-button pt-active' : 'pt-button'}>Journals</Link>
							<Link to={{ pathname: this.props.pathname, query: { ...query, mode: 'all' } }} className={mode === 'all' ? 'pt-button pt-active' : 'pt-button'}>All</Link>
						</div>
					</div>
					<div style={styles.headerRight}>
						<DropdownButton 
							content={
								<Menu>
									<li className={'pt-menu-header'}><h6>Sort by:</h6></li>
									<MenuDivider />
									{sortList.map((sort, index)=> {
										const sortMode = query.sort || 'Newest';
										return (
											<li key={'sortFilter-' + index}><Link to={{ pathname: this.props.pathname, query: { ...this.props.query, sort: sort } }} className="pt-menu-item pt-popover-dismiss">
												{sort}
												{sortMode === sort && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
											</Link></li>
										);
									})}
								</Menu>
							}
							title={'Sort'} 
							position={2} />
					</div>
				</div>


				{(mode === undefined || mode === 'pubs') && 
					this.sortList(followsPubs).map((follower, index)=> {
						return <PreviewPub key={'followsPub-' + index} pub={follower} />;
					})
				}

				{mode === 'users' && 
					this.sortList(followsUsers).map((follower, index)=> {
						return <PreviewUser key={'followsUser-' + index} user={follower} />;
					})
				}
				
				{mode === 'journals' && 
					this.sortList(followsJournals).map((follower, index)=> {
						return <div key={'followsJournal-' + index}>{follower.name}</div>;
					})
				}

			</div>
		);
	}
});

export default Radium(UserFollowing);

styles = {
	container: {
		
	},
	headerWrapper: {
		display: 'table',
		width: '100%',
		marginBottom: '1em',
	},
	headerTitle: {
		display: 'table-cell',
		verticalAlign: 'middle',
		paddingRight: '1em',
		width: '1%',
		whiteSpace: 'nowrap',
	},
	header: {
		margin: 0,
	},
	headerOptions: {
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	headerRight: {
		display: 'table-cell',
		verticalAlign: 'middle',
		width: '1%',
	},
	noWrap: {
		whiteSpace: 'nowrap',
	},
};
