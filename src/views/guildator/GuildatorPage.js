import Guildator from 'components/guildator/Guildator';
import DefaultPicker from 'components/widgets/pickers/default/DefaultPicker';
import Uploader from 'components/widgets/uploader/Uploader';
import React, {useState} from 'react';

import './GuildatorPage.scss';

const CLASS = 'st-GuildatorPage';

const PARTS = {
	helmet: 'helmet',
	head: 'head',
	body: 'body',
	weapon: 'weapon',
};

export default function GuildatorPage() {
	const [, setImage] = useState(null);
	const [part, setPart] = useState(null);
	const [parts, setParts] = useState({});

	const options = Object.keys(PARTS).map(item => ({value: item, label: item}));

	const handleImage = image => {
		setParts(prevState => ({...prevState, [part.value]: image.preview}));
		setImage(image);
	};

	return (
		<div className={CLASS}>
			<Guildator {...parts} />

			<div className={CLASS + '-uploader'}>
				<DefaultPicker label="Set part" onChange={setPart} options={options} value={part} />
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
