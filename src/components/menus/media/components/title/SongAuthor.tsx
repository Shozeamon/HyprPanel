import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';
import { mediaArtist } from 'src/services/media';
import options from 'src/configuration';

const { hideAuthor } = options.menus.media;

export const SongAuthor = (): JSX.Element => {
    if (hideAuthor.get()) {
        return <box />;
    }

    return (
        <box className={'media-indicator-current-song-author'} halign={Gtk.Align.CENTER}>
            <label
                className={'media-indicator-current-song-author-label'}
                label={bind(mediaArtist)}
                maxWidthChars={35}
                truncate
                wrap
            />
        </box>
    );
};
