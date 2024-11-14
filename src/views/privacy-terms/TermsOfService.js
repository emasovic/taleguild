import React from 'react';
import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';

import Helper from './Helper';

const TERMS = [
	{
		title: 'Terms of Service',
		titleProps: {
			font: FONTS.merri,
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h1,
			component: TYPOGRAPHY_VARIANTS.h1,
		},
		subtitle: `Welcome to the Taleguild platform. These terms of service are a contract between you
		and Taleguild. By using taleguild.com (the “Site”), creating your Taleguild account
		and using the Site to post various content to the Taleguild community, including
		stories you create, comments and messages, or to access and view Taleguild content
		or other user content (together with the Site, the “Services”), you’re agreeing to
		these Terms of Service. If you don’t agree to any of these terms, you can’t use the
		Taleguild Services.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `You need to be 13 years old and over`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `Taleguild Services are only for people 13 years old and over. If we learn someone under 13 is using Taleguild Services, we’ll terminate their account.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `You need an Account for some services`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `You can’t browse very much on the Site or use the Services without registering for an account. You can read stories, but can’t write your stories, like others and comment. To get the most out of the Taleguild platform, you’ll need to register, choose an account name, and set a password. You’re responsible for all the activity on your ac and for keeping your password confidential. If you share your account information with anyone, that other person may be able to take control of the ac and we may not be able to determine who is the proper account holder. We will not have any liability to you (or anyone you share your account information with) as a result of your or their actions under those circumstances. If you find out that someone’s used your account without your permission, you should report it at contact@taleguild.com`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Your Content is Yours`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `Before posting any content to Taleguild, it is important that you read our Content Guidelines. If your content does not comply with these guidelines it may be removed at any time. You own all the rights to the content you create and post on the Taleguild Services. Of course, if the content wasn’t yours to begin with, putting it on Taleguild doesn’t make it yours. Don’t submit content you don’t hold the copyright for (unless you have permission, including to grant Taleguild all the rights outlined in these terms). You’re responsible for the content you post. This means you assume all risks related to its publication and display, including someone else’s reliance on its accuracy and any claims relating to intellectual property or other legal rights. Taleguild is a free service and to continue to make it free you understand that we enable advertising on the Services, including in connection with the display of your content or other information. We may also use your Content to promote the Services. We will never sell your content to third parties without your explicit permission.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Our Rights in the Services`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `We reserve all rights in the Sites’ and the Services look and feel, and in our content. You may not copy or adapt any portion of our code or visual design elements (including logos) without express written permission from Taleguild or as set out in this clause. Please do not use our logo or trademarks in any way that might suggest Taleguild endorses a particular product or service, or you have a business relationship with Taleguild. Please do not alter, stretch, condense, embellish, add sparkles to, or otherwise change our logo in any way. We’re pretty proud of our logo, and we’d like to keep it as it is. Taleguild may change, terminate, or restrict access to any aspect of the Services, at any time, without notice. We can remove any content you post or submit for any reason. Taleguild may access, read, preserve, and disclose any information as we reasonably believe is necessary to (i) satisfy any applicable law, regulation, legal process or governmental request, (ii) enforce the Terms of Service, including investigation of potential violations, (iii) detect, prevent, or otherwise address fraud, security or technical issues, (iv) respond to user support requests, or (v) protect the rights, property or safety of the Services, its users and the public.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Content Guidelines`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `We celebrate free speach, free thought and free expression. Hovewer, However, before posting any story or comment be aware that your content may read a person below 18 and children. In order to protect persons under 18 and children, include Adult 18+ in a list of your Categories when you are publishing a story. Adult 18+ category includes content with explicit sex scenes, self-harm themes or scenes (including suicide and eating disorders), graphic depictions of violence; including but not limited to: sexual, verbal, emotional and physical abuse.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `What We Remove`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `The following are not allowed on Taleguild. This is not a complete list, and we have the right to remove any content that we find inappropriate. Any content that could put our community at risk will be removed. Taleguild has the right to close any account or remove content without notice.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Sexual Content on Taleguild`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `Pornographic Content: Taleguild considers content to be pornographic when it exists solely for the purpose of sexual stimulation; Age of Consent: The age of consent is 16+ on Taleguild. Any sexual content between characters must abide by this age of consent; Glorification of Sexual Violence: Taleguild classNameifies non-consensual sexual acts to include rape, sexual assault, kidnapping for sexual purposes, or sexual slavery. The content cannot be encouraging or promoting of non-consensual sex acts; Sexual Roleplay or Messaging: Taleguild does not permit sexual messages or solicitation. This includes posting content which encourages sexual private messages, on or off Taleguild, or posting rules for public or private roleplay that are intended for sexual purposes; Illegal Sex Acts: Any content which encourages illegal sex acts including, but not limited to, bestiality or necrophilia, will be removed.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Media on Taleguild`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `Media on Taleguild includes images, videos, gifs, and sound clips. To help keep Taleguild a safe space for everyone to create and discover content, we may remove images that don’t follow our Content Guidelines. The following Media is not allowed on Taleguild, and will be removed: Media containing full exposure of any private parts, such as genitalia, breasts, and buttocks; Media displaying sexual intercourse, or any other sexual act, regardless of whether private parts are visible; Media displaying self-harm or suicide; Images of people posted without their consent, except for public figures and celebrities; Any other media which captures an illegal act. Taleguild has the right to remove any media deemed unfit for Taleguild .`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Self-Harm on Taleguild`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `If you are struggling with eating disorders, addiction, self-harm, thoughts of suicide, or other challenges, we want you to know that you are supported. Keep in mind that reading about self-harm and suicide can be upsetting or triggering. That’s why we want to remind you that: Content that encourages or gives instruction on self-harm will be removed; Content that contains lots of description might be rated Adult 18+, and stories that glorify or do not “tell a story” might be removed. “Telling a story” means the work must have a plot unrelated to the self-harm scene/s, or must show a progression or growth in its characters; We want to encourage healthy discussions about these issues, so content about recovery, survival or that portray the negative consequences of self-harm are acceptable on Taleguild.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Violence`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `There are many forms of violence that can be harmful to our community. We will remove any content or accounts that are intended to shock or disgust our community.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Hate Groups/Extremist Content`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `At Taleguild, we are committed to keeping our community safe. We value diversity and storytelling, so we want to make sure that the stories being told on Taleguild do not contribute to real-world harm. The following guidelines have been developed in order to maintain a positive community. On Taleguild , you are not allowed to make physical threats of violence or threats of death towards any individual or group of people. We will not allow stories or individuals that glorify, praise or romanticize current real life violent hate groups, figures, or extremist organizations with violent or hateful intentions. This includes: Groups that express a violent mission; Organized hate groups; Terrorist activity; Single event mass shooters/murderers.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Talking about Others`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `Sharing opinions on stories and the quality or style of writing is ok. We aim to create a safe community for everyone on Taleguild, so be kind, respectful, and please treat others as you would want to be treated, so don’t post any content that: Bashes a user purely for personal reasons; Reveals any personally identifying information about other people, including private messages, photographs/videos (Due to the fictional nature of stories and the chances of real names being used coincidentally, we are unable to remove a work for having the same or similar name to a real person. Only if there is additional identifying information, such as the city you reside or your work/school, is there a violation of our content guidelines); Actively promotes violence or hatred. The promotion of hatred on the basis of race, ethnicity, religion, disability, gender, age, or sexual orientation, or content that is intended to bully, threaten, or harass others, is also strictly prohibited. General expressions of opinions are allowed, but they cannot be violent in nature or encourage others to attack Taleguild community members.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
	{
		title: `Spam`,
		titleProps: {
			fontWeight: FONT_WEIGHT.bold,
			variant: TYPOGRAPHY_VARIANTS.h4,
			component: TYPOGRAPHY_VARIANTS.h4,
		},
		subtitle: `Any content that advertises products or services unrelated to, or not sanctioned by Taleguild is not permitted and will be removed.`,
		subtitleProps: {component: TYPOGRAPHY_VARIANTS.p},
	},
];

export default function TermsOfService() {
	return <Helper sections={TERMS} />;
}
