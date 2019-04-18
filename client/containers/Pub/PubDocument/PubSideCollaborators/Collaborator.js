import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';

require('./collaborator.scss');

const propTypes = {
	attribution: PropTypes.object.isRequired,
};

const Collaborator = function(props) {
	const user = props.attribution.user;
	const avatarElement = user.slug ? (
		<a href={`/user/${user.slug}`}>
			<Avatar userInitials={user.initials} userAvatar={user.avatar} width={40} />
		</a>
	) : (
		<Avatar userInitials={user.initials} userAvatar={user.avatar} width={40} />
	);

	const nameElement = user.slug ? (
		<a href={`/user/${user.slug}`} className="underline-on-hover">
			{user.fullName}
		</a>
	) : (
		<span>{user.fullName}</span>
	);

	const roles = props.attribution.roles || [];
	const rolesString = roles.reduce((prev, curr) => {
		if (prev) {
			return `${prev}, ${curr}`;
		}
		return curr;
	}, '');

	return (
		<div className="pub-document_side-collaborator_user-component">
			<div className="avatar-wrapper">{avatarElement}</div>
			<div className="details-wrapper">
				<div className="name">{nameElement}</div>
				<div>{user.title}</div>
				{!!rolesString && <div className="roles">Roles: {rolesString}</div>}
			</div>
		</div>
	);
};

Collaborator.propTypes = propTypes;
export default Collaborator;
