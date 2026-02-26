export function intersectSets(sets: Set<any>[]) {
	if (!sets || sets.length === 0) {
		return new Set();
	}

	let intersection = new Set(sets[0]);

	for (let i = 1; i < sets.length; i++) {
		intersection = intersection.intersection(sets[i]);
	}

	return intersection;
}

export function* chain(...iterables: any[]) {
	for (const iterable of iterables) {
		for (const item of iterable) {
			yield item;
		}
	}
}

export function parseJoinText(text: string): string {
	const ignored_text = [
		'⁦⁦',
		'⁩ ',
		'⁦',
		'⁩⁩',
		',',
		'\n',
		'\r',
		':',
		' 님이 방에 참가했습니다.',
		' 님이 그룹에 참여했습니다.',
		' 님이 로비에 참가하셨습니다.',
		' 進入組隊房間',
		' 加入了队伍聊天',
		' が入室しました。',
		' がロビーに参加しました',
		' joined the room',
		' joined the lobby',
		' joined the group',
		' a rejoint la salle',
		' a rejoint le salon',
		' hat den Chatraum betreten',
		' ist der Lobby beigetreten',
		' dołączył do pokoju',
		' dołącza do pokoju',
		' vstoupil do lobby',
		' μπήκε στο δωμάτιο',
		' μπήκε στο λόμπι',
		' присоединился к лобби',
		' \xe8 entrato nella stanza',
		' a intrat \xeen sală',
		' entr\xf3 en la sala',
		' entr\xf3 a la sala',
		' entrou no sagu\xe3o',
		' entrou na sala',
		' entrou no sagu\xe3o',
		' se ha unido a la sala',
		' se uni\xf3 a la sala',
		' odaya katıldı',
		' lobiye katıldı'
	];

	const lines = text.split('\n');
	const summoners_names = new Set();
	for (let l of lines) {
		const prefix = ' : ';
		const substr = l.substring(0, prefix.length);
		if (substr === prefix) {
			continue;
		}

		for (const j of ignored_text) {
			if (l.includes(j)) {
				l = l.replace(j, '');
			}
		}

		if (l) {
			summoners_names.add(l);
		}
	}

	return Array(...summoners_names).join('\n');
}

// thanks gemini
export function nCr(n: number, r: number): bigint {
	if (r < 0 || r > n) return 0n;
	if (r === 0 || r === n) return 1n;

	// Optimization: nCr is symmetric, so nCr(10, 8) == nCr(10, 2)
	if (r > n / 2) r = n - r;

	let result = 1n;
	for (let i = 1n; i <= BigInt(r); i++) {
		result = (result * (BigInt(n) - i + 1n)) / i;
	}

	return result;
}
