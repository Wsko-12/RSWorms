import PageBuilder from '../../../utils/pageBuilder';

export default function createSettingsPage(w: number, h: number) {
    const settings = PageBuilder.createElement('div', { classes: 'settings' });
    settings.style.width = w + 'px';
    settings.style.height = h + 'px';
    settings.style.top = h * 2 + 'px';
    settings.style.left = w * 2 + 'px';
    const returnBtn = PageBuilder.createElement('div', { classes: 'return-button' });
    returnBtn.style.backgroundImage = 'url(../../assets/lobby/return.png)';

    const createTeamContainer = PageBuilder.createElement('div', { classes: 'create-team-container' });
    const audioOptionsContainer = PageBuilder.createElement('div', { classes: 'audio-options-container' });

    // const teamNameContainer = PageBuilder.createElement('div', { classes: 'team-name-container' });
    // const teamNameTitle = PageBuilder.createElement('h3', { classes: 'team-name-title' });
    // teamNameTitle.innerHTML = 'Team Name';
    // const teamNameInput = PageBuilder.createElement('input', { classes: 'text-input', id: 'team-name' });
    // teamNameContainer.append(teamNameTitle, teamNameInput);
    // createTeamContainer.append(teamNameContainer);

    createTeamContainer.innerHTML = `
            <div class="team-name-container">
                <h3 class="settings-title">Team Name</h3>
                <div class="team-name-input-container">
                    <input class="input-text team-name" type="text" value="Team">
                    <button class="random-btn" id="team-random-btn">?</button>
                </div>
            </div>
            <div class="team-name-container">
                <h3 class="settings-title">Team Members</h3>
                <div class="team-name-input-container">
                    <input class="input-text worm-name" id="team-name" type="text" value="Worm 1" data-id="worm1">
                    <button class="random-btn" id="member-random-btn" data-id="worm1">?</button>
                </div>
                <div class="team-name-input-container">
                    <input class="input-text worm-name" type="text" value="Worm 2" data-id="worm2">
                    <button class="random-btn" id="member-random-btn" data-id="worm2">?</button>
                </div>
                <div class="team-name-input-container">
                    <input class="input-text worm-name" type="text" value="Worm 3" data-id="worm3">
                    <button class="random-btn" id="member-random-btn" data-id="worm3">?</button>
                </div>
                <div class="team-name-input-container">
                    <input class="input-text worm-name" type="text" value="Worm 4" data-id="worm4">
                    <button class="random-btn" id="member-random-btn" data-id="worm4">?</button>
                </div>
                <div class="team-name-input-container">
                    <input class="input-text worm-name" type="text" value="Worm 5" data-id="worm5">
                    <button class="random-btn" id="member-random-btn" data-id="worm5">?</button>
                </div>
                <div class="team-name-input-container">
                    <input class="input-text worm-name" type="text" value="Worm 6" data-id="worm6">
                    <button class="random-btn" id="member-random-btn" data-id="worm6">?</button>
                </div>
            </div>
            <button class="create">Create Team</button>
        `;

    audioOptionsContainer.innerHTML = `
            <div class="audio-volume-container">
                <h3 class="settings-title">Sound Options</h3>
                <div class="volume-container">
                    <h4 class="settings-volume-title">Background Volume</h4>
                    <input type="range" name="volume" class="volume" id="volume-bg">
                </div>
                <div class="volume-container">
                    <h4 class="settings-volume-title">SoundFX Volume</h4>
                    <input type="range" name="volume" class="volume" id="volume-sfx">
                </div>
                <div class="volume-container">
                    <h4 class="settings-volume-title">Worm Speech Volume</h4>
                    <input type="range" name="volume" class="volume" id="volume-worm">
                </div>
            </div>
            <div class="audio-speech-container">
                <h3 class="settings-title">Worm Speech Options<h3>
                <div class="__select" data-state="">
                <div class="__select__title">English</div>
                <div class="__select__content">
                  <input id="singleSelect0" class="__select__input" type="radio" name="singleSelect"/>
                  <label for="singleSelect0" class="__select__label">English</label>
                  <input id="singleSelect0" class="__select__input" type="radio" name="singleSelect" checked/>
                  <label for="singleSelect0" class="__select__label">Russian</label>
                  <input id="singleSelect1" class="__select__input" type="radio" name="singleSelect" />
                  <label for="singleSelect1" class="__select__label">San Andreas</label>
                  <input id="singleSelect2" class="__select__input" type="radio" name="singleSelect" />
                  <label for="singleSelect2" class="__select__label">Some other</label>
                  <input id="singleSelect3" class="__select__input" type="radio" name="singleSelect" />
                  <label for="singleSelect3" class="__select__label">Another one</label>
                </div>
              </div>
            </div>
        `;
    settings.append(returnBtn, createTeamContainer, audioOptionsContainer);
    return settings;
}
