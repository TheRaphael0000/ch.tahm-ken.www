import { chain, intersectSets } from './utils';

import champions_json from 'data/cache/datadragon/champion.json';
import challenges_json from 'data/lcu/challenges.json';
import challenge_labels from 'data/challenge_labels.json';

export const challengesRanks = [
	'IRON',
	'BRONZE',
	'SILVER',
	'GOLD',
	'PLATINUM',
	'DIAMOND',
	'MASTER',
	'GRANDMASTER',
	'CHALLENGER'
];
export const champions = Object.entries(champions_json.data).map((c) => c[1]);
export const championsMap = new Map(Object.entries(champions_json.data));
export const championsMapKey = new Map(
	Object.entries(champions_json.data).map((c) => [c[1].key, c[1]])
);

export const championsByTags = new Map<string, number[]>();
for (const champion of champions) {
	for (const tag of champion.tags) {
		if (!championsByTags.has(tag)) championsByTags.set(tag, []);
		championsByTags.get(tag)?.push(Number(champion.key));
	}
}

// Put challenges into a flat array with and apply labels
export const challenges = Object.values(challenges_json).map((challenge) => ({
	...challenge,
	label: challenge_labels.find((l) => l.id == challenge.id)?.label || '',
	internalId: `${challenge.id}`
}));

const varietyIsOverrated = challenges.find((c) => c.id == 303408);

for (const tag of championsByTags.keys()) {
	const clone = structuredClone(varietyIsOverrated);
	if (!clone) continue;
	clone.internalId = `${clone.id}_${tag}`;
	clone.availableIds = championsByTags.get(tag) || [];
	clone.label = tag;
	challenges.push(clone);
}

challenges.splice(
	challenges.findIndex((c) => c.id == 303408),
	1
);

challenges.sort((c1, c2) => c1.id - c2.id);

export const challengesGroups = [
	{
		main: challenges_json[303400],
		challenges: challenges.filter((c) => challenges_json[303400].childrenIds.includes(c.id))
	},
	{
		main: challenges_json[303500],
		challenges: challenges.filter((c) => challenges_json[303500].childrenIds.includes(c.id))
	}
];
export const challengesSite = [...chain(...challengesGroups.map((g) => g.challenges))];

export function getChallengeRequirements(challenge: any) {
	if ([303407, 303408].includes(challenge.id) || challenge.parentId == 303500) return 5;
	else return 3;
}

export function getChampions(challenges: any[]) {
	const sets = [];
	for (const challenge of challenges) {
		sets.push(new Set<number>(challenge.availableIds));
	}

	const result: any[] = [...intersectSets(sets)]
		.map((key: number) => champions.find((c) => c.key == key.toString()))
		.filter((k: any) => k != undefined);

	return result;
}
