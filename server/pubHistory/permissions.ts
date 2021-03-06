import { getScope } from 'server/utils/queryHelpers';

export const getPermissions = async ({ userId, communityId, pubId, accessHash, historyKey }) => {
	const {
		elements: { activePub },
		activePermissions: { canView, canViewDraft },
	} = await getScope({
		pubId,
		communityId,
		loginId: userId,
		accessHash,
	});
	const isReleaseKey = activePub.releases.some((release) => release.historyKey === historyKey);
	return { canCreateExport: isReleaseKey || canView || canViewDraft };
};
