import { Gtk } from 'astal/gtk3';
import { bind, timeout } from 'astal';
import { isDiscovering } from './helper';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { isPrimaryClick } from 'src/lib/events/mouse';

const bluetoothService = AstalBluetooth.get_default();

export const DiscoverButton = (): JSX.Element => (
    <button
        className="menu-icon-button search bluetooth"
        valign={Gtk.Align.CENTER}
        onClick={(_, self) => {
            if (!isPrimaryClick(self)) {
                return;
            }

            if (bluetoothService.adapter?.discovering) {
                return bluetoothService.adapter.stop_discovery();
            }

            bluetoothService.adapter?.start_discovery();

            const discoveryTimeout = 12000;
            timeout(discoveryTimeout, () => {
                if (bluetoothService.adapter?.discovering) {
                    bluetoothService.adapter.stop_discovery();
                }
            });
        }}
    >
        <icon
            className={bind(isDiscovering).as((isDiscovering) => (isDiscovering ? 'spinning-icon' : ''))}
            icon="view-refresh-symbolic"
        />
    </button>
);
