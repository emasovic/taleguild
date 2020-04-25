import React from 'react';
import {Col, Card, CardImg, CardBody, CardText, ButtonGroup} from 'reactstrap';

import FA from '../../types/font_awesome';
import {COLOR} from '../../types/button';

import IconButton from 'components/widgets/button/IconButton';

import testBg from 'images/testBackground.jpg';

import './StoryItem.scss';

export default function StoryItem({src, text, title, creator, createdDate}) {
	return (
		<Col>
			<Card>
				<div className="st-ImgTextTop"></div>
				<CardImg
					top
					width="100%"
					src={testBg}
					alt="Card image cap"
					style={{marginTop: -40}}
				/>
				<div className="st-ImgTextBottom">
					<p>{title}</p>
					<span>{creator + ' ' + createdDate}</span>
				</div>

				<CardBody style={{width: '100%'}}>
					<CardText>
						{text} Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industry's standard dummy text ever since
						the 1500s, when an unknown printer took a galley of type and scrambled it to
						make a type specimen book. It has survived not only five centuries, but also
						the leap
					</CardText>
				</CardBody>
				<div
					className="st-CardFooter"
					style={{borderTop: '1px solid rgba(0,0,0,0.2)', display: 'flex', padding: 5}}
				>
					<ButtonGroup size="sm" style={{}}>
						<IconButton color={COLOR.secondary} icon={FA.heart} />
					</ButtonGroup>

					<IconButton color={COLOR.primary}>Citaj</IconButton>
				</div>
			</Card>
		</Col>
	);
}
