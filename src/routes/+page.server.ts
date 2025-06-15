import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

const animalEmojis = [
	// Mammals
	'🐒',
	'🦍',
	'🦧',
	'🐕',
	'🦮',
	'🐕‍🦺',
	'🐩',
	'🐺',
	'🦊',
	'🦝',
	'🐈',
	'🦁',
	'🐅',
	'🐆',
	'🐴',
	'🐎',
	'🦓',
	'🦌',
	'🐂',
	'🐃',
	'🐄',
	'🐖',
	'🐗',
	'🐏',
	'🐑',
	'🐐',
	'🐪',
	'🐫',
	'🦙',
	'🦒',
	'🐘',
	'🦏',
	'🦛',
	'🐁',
	'🐀',
	'🐹',
	'🐇',
	'🐿️',
	'🦔',
	'🦇',
	'🐻',
	'🐨',
	'🐼',
	'🦥',
	'🦦',
	'🦨',
	'🦘',
	'🦡',

	// Birds
	'🦃',
	'🐔',
	'🐓',
	'🐣',
	'🐤',
	'🐥',
	'🐦',
	'🐧',
	'🕊️',
	'🦅',
	'🦆',
	'🦢',
	'🦉',
	'🦩',
	'🦜',

	// Marine & Reptiles
	'🐸',
	'🐊',
	'🐢',
	'🦎',
	'🐍',
	'🐳',
	'🐋',
	'🐬',
	'🐟',
	'🐠',
	'🐡',
	'🦈',
	'🐙',
	'🦀',
	'🦞',
	'🦑',

	// Bugs
	'🐌',
	'🦋',
	'🐛',
	'🐜',
	'🐝',
	'🐞'
];

// https://stackoverflow.com/a/19270021
function getRandom(arr: string[], n: number) {
	var result = new Array(n),
		len = arr.length,
		taken = new Array(len);
	if (n > len) throw new RangeError('getRandom: more elements taken than available');
	while (n--) {
		var x = Math.floor(Math.random() * len);
		result[n] = arr[x in taken ? taken[x] : x];
		taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

export const load: PageServerLoad = async () => {
	const siteList = await db.select({ site: sites.link }).from(sites).orderBy(sites.order);

	return {
		sites: siteList,
		emojis: getRandom(animalEmojis, siteList.length)
	};
};
