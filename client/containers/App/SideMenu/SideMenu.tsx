import React from 'react';
import classNames from 'classnames';
import Color from 'color';
import { Icon } from 'components';
import { usePageContext } from 'utils/hooks';
import { getDashUrl, getDashboardModes } from 'utils/dashboard';
import ScopePicker from './ScopePicker';

require('./sideMenu.scss');

const SideMenu = () => {
	const { locationData, communityData, scopeData } = usePageContext();
	const { activeCounts, activePermissions, elements } = scopeData;
	const { canManage } = activePermissions;
	const { activeTargetType, activeCollection } = elements;
	const collectionSlug = activeCollection && activeCollection.slug;
	const pubSlug = locationData.params.pubSlug;

	const backgroundColor = Color(communityData.accentColorDark)
		.fade(0.95)
		.rgb()
		.string();

	const contentItems = [
		{
			title: 'Overview',
			icon: 'home2',
			href: getDashUrl({ collectionSlug, pubSlug }),
		},
		{
			title: 'Pages',
			icon: 'page-layout',
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'pages',
			}),
			validScopes: ['community'],
			manageRequired: true,
		},
		{
			title: 'Layout',
			icon: 'page-layout',
			href: getDashUrl({
				collectionSlug,
				mode: 'layout',
			}),
			manageRequired: true,
			validScopes: ['collection'],
		},
		{
			title: 'Reviews',
			icon: 'social-media',
			count: activeCounts.reviewCount > 0 ? activeCounts.reviewCount : undefined,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'reviews',
			}),
		},
		{
			title: 'Connections',
			icon: 'layout-auto',
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'connections',
			}),
			validScopes: ['pub'],
		},
		{
			title: 'Impact',
			icon: 'dashboard',
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'impact',
			}),
			validScopes: ['pub', 'community'],
		},
		{
			title: 'Members',
			icon: 'people',
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'members',
			}),
			manageRequired: true,
		},
		{
			title: 'Settings',
			icon: 'cog',
			href: getDashUrl({
				collectionSlug,
				pubSlug,
				mode: 'settings',
			}),
			manageRequired: true,
		},
	];

	return (
		<div className="side-menu-component">
			<style
				/* eslint-disable-next-line react/no-danger */
				dangerouslySetInnerHTML={{
					__html: `
						.menu.active:before { background: ${communityData.accentColorDark} }
						.side-menu-component { background: ${backgroundColor} }
					`,
				}}
			/>
			<ScopePicker />

			<div className="content">
				{contentItems
					.filter((item) => {
						const { validScopes, manageRequired } = item;
						const scopeIsValid = !validScopes || validScopes.includes(activeTargetType);
						const permissionIsValid = canManage || !manageRequired;
						return scopeIsValid && permissionIsValid;
					})
					.map((item) => {
						const { mode } = getDashboardModes(locationData);
						const itemMode = item.title.toLowerCase().replace(/ /gi, '-');
						const active = mode === itemMode;
						return (
							<div key={item.title} className={classNames({ menu: true, active })}>
								<a
									href={item.href}
									className={classNames({
										'content-title': true,
										// @ts-expect-error ts-migrate(2339) FIXME: Property 'children' does not exist on type '{ titl... Remove this comment to see the full error message
										'has-children': item.children,
										active,
									})}
								>
									<Icon className="side-icon" icon={item.icon} />
									<span className="side-text">{item.title}</span>
									{item.count !== undefined && (
										<span className="count-wrapper">
											<span className="count">{item.count}</span>
										</span>
									)}
								</a>
								{/* active &&
									item.children &&
									item.children.map((child) => {
										const childActive =
											child.title.toLowerCase().replace(/ /gi, '-') ===
											locationData.params.submode;
										return (
											<a
												key={child.title}
												href={child.href}
												className={classNames({
													child: true,
													active: childActive,
												})}
											>
												{child.title}
											</a>
										);
									}) */}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default SideMenu;
