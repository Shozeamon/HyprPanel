import './src/lib/session';
import './src/scss/style';
import './src/shared/useTheme';
import './src/shared/wallpaper';
import './src/shared/systray';
import './src/shared/dropdown';
import './src/shared/utilities';
import './src/components/bar/utils/sideEffects';

import AstalHyprland from 'gi://AstalHyprland?version=0.1';
const hyprland = AstalHyprland.get_default();

import { Bar } from './src/components/bar';
import { DropdownMenus, StandardWindows } from './src/components/menus/exports';
import Notifications from './src/components/notifications';
import SettingsDialog from './src/components/settings/index';
import { bash, forMonitors } from 'src/lib/utils';
import options from 'src/options';
import OSD from 'src/components/osd/index';
import { App } from 'astal/gtk3';
import { execAsync } from 'astal';
import { handleRealization } from 'src/components/menus/shared/dropdown/helpers';
import { isDropdownMenu } from 'src/lib/constants/options.js';
import { initializeSystemBehaviors } from 'src/lib/behaviors';
import { runCLI } from 'src/cli/commander';

const initializeStartupScripts = (): void => {
    execAsync(`python3 ${SRC_DIR}/scripts/bluetooth.py`).catch((err) => console.error(err));
};

const initializeMenus = (): void => {
    StandardWindows.forEach((window) => {
        return window();
    });

    DropdownMenus.forEach((window) => {
        return window();
    });

    DropdownMenus.forEach((window) => {
        const windowName = window.name.replace('_default', '').concat('menu').toLowerCase();

        if (!isDropdownMenu(windowName)) {
            return;
        }

        handleRealization(windowName);
    });
};

App.start({
    instanceName: 'hyprpanel',
    requestHandler(request: string, res: (response: unknown) => void) {
        runCLI(request, res);
    },
    async main() {
        initializeStartupScripts();

        Notifications();
        OSD();

        const barsForMonitors = await forMonitors(Bar);
        barsForMonitors.forEach((bar: JSX.Element) => bar);

        SettingsDialog();
        initializeMenus();

        initializeSystemBehaviors();
    },
});

hyprland.connect('monitor-added', () => {
    const { restartCommand } = options.hyprpanel;

    if (options.hyprpanel.restartAgs.get()) {
        bash(restartCommand.get());
    }
});
