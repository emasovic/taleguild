import React, {useState} from 'react';

import {PARTS} from 'types/guildatar';

import Guildatar from 'components/guildatar/Guildatar';
import DefaultPicker from 'components/widgets/pickers/default/DefaultPicker';
import Uploader from 'components/widgets/uploader/Uploader';

import './GuildatarPlayground.scss';

const CLASS = 'st-GuildatarPlayground';

export default function GuildatarPlayground() {
	const [, setImage] = useState(null);
	const [part, setPart] = useState(null);
	const [parts, setParts] = useState({});

	const handleImage = image => {
		setParts(prevState => ({...prevState, [part.value]: image.preview}));
		setImage(image);
	};

	return (
		<div className={CLASS}>
			<Guildatar {...parts} />

			<div className={CLASS + '-uploader'}>
				<DefaultPicker label="Set part" onChange={setPart} options={PARTS} value={part} />
				<Uploader
					previewOnly
					onUploaded={image => handleImage(image)}
					uploadlabel="Upload item"
					onRemove={() => setImage(null)}
					// files={image}
				/>
			</div>
		</div>
	);
}
