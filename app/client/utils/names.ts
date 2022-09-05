const randomTeamNames = [
    'Developers',
    'ProjectCrashers',
    'Loosers',
    'Bad Guys',
    'Seniors',
    'Brotherhood',
    'Noobs',
    'Boomers',
    'Cowboys',
    'Inglourious Basterds',
    'Gentlemens',
    'Bitcoins',
    'Masons',
    'Nerds',
    'Rock Stars',
    'Siths',
    'Jedi',
    'Anonymous',
    'Terrorists',
    'Vandals',
    'Bandits',
];
const randomMemberNames = [
    'Aleg3000',
    'Wsko',
    'Overlord',
    'Guy',
    'Big One',
    'OG Worm',
    'Fat Ass',
    'Rat',
    'Lil Worm',
    'Spider-worm',
    'Mr. Popov',
    'Big Daddy',
    'Cat',
    'Student 1',
    'Hannibal',
    'Dr. Stupid',
    'Hot Dog',
    'Lenin',
    'Bacon',
    'Immortal',
    'Sticky',
    'Snake',
    'Harry Potter',
    'Helmut',
    'Buddy',
    'Obama',
    'Bilbo',
    'Frodo',
];

export function getRandomMemberName() {
    const index = Math.floor(Math.random() * randomMemberNames.length);
    return randomMemberNames[index];
}

export function getRandomTeamName() {
    const index = Math.floor(Math.random() * randomTeamNames.length);
    return randomTeamNames[index];
}

export function generateId() {
    const arr: string[] = [];
    //letters
    for (let i = 65; i <= 90; i++) {
        //O and I and B
        if (i != 79 && i != 73 && i != 66) {
            arr.push(String.fromCharCode(i));
        }
    }

    //numbers
    for (let i = 49; i <= 57; i++) {
        arr.push(String.fromCharCode(i));
    }

    let id = '';
    for (let i = 0; i < 7; i++) {
        const index = Math.floor(Math.random() * arr.length);
        id += arr[index];
    }

    return id;
}
