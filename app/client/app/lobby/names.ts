const randomTeamNames = ['Developers', 'ProjectCrashers', 'Loosers', 'Bad Guys', 'Seniors'];
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
];

export function getRandomMemberName() {
    const index = Math.floor(Math.random() * randomMemberNames.length);
    return randomMemberNames[index];
}

export function getRandomTeamName() {
    const index = Math.floor(Math.random() * randomTeamNames.length);
    return randomTeamNames[index];
}
