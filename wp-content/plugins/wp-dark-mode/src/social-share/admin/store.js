import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const t = (key) => window.wp_dark_mode_admin_json?.strings?.[key] || key;

const svgIcons = {
	share: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
		<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
	</svg>`,
	palette: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
		<path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
		<path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"/>
	</svg>`,
	mobile: `<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-4" viewBox="0 0 16 16">
		<path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
		<path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
	</svg>`,
	desktop: `<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-5" viewBox="0 0 16 16">
		<path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
	</svg>`,
};

export const TABS = [
	{ id: 'channels', icon: svgIcons.share, title: t( 'social_channels' ) },
	{ id: 'customization', icon: svgIcons.palette, title: t( 'customization' ) },
];

export const BUTTON_POSITIONS = {
	above: t( 'above' ),
	below: t( 'below' ),
	both: t( 'above_below' ),
};

export const BUTTON_ALIGNMENTS = {
	left: t( 'left' ),
	center: t( 'center' ),
	right: t( 'right' ),
	stretch: t( 'stretch' ),
};

export const BUTTON_SHAPES = {
	rounded: t( 'rounded' ),
	circle: t( 'circle' ),
	rectangular: t( 'rectangular' ),
	slanted: t( 'slanted' ),
};

export const BUTTON_SIZES = {
	1: 'S',
	1.2: 'M',
	1.4: 'L',
	1.6: 'XL',
};

export const BUTTON_LABELS = {
	channel_label: t( 'channel_label' ),
	share_count: t( 'share_count' ),
	both: t( 'both' ),
	none: t( 'none' ),
};

export const DEVICES = {
	mobile: { name: t( 'mobile' ), icon: svgIcons.mobile },
	desktop: { name: t( 'desktop' ), icon: svgIcons.desktop },
};

export const useSocialShareStore = defineStore( 'SocialShare', () => {
	const state = reactive( {
		noWatch: true,
		activeTab: 'channels',
		search_channels: '',
		showAllChannels: false,
		channels: [],
		post_types: [],
		draggingChannel: 'unknown',
		isChanged: false,
		saved: false,
		savedTimer: null,
		savedOptions: {},
		promptModal: {
			show: false,
			channel: null,
			prompt: '',
		},
	} );

	const options = ref( { enable: false } );

	/**
	 * Whether Ultimate is active. Display-only - drives badges/lock icons, never
	 * gates channel enable/save logic (that's availableChannelIds, below).
	 */
	const isUltimate = computed( () =>
		[ true, 1, '1', 'true' ].includes( window.wp_dark_mode_social_share.is_ultimate )
	);
	const isPro = computed( () => isUltimate.value );
	const isFree = computed( () => ! isPro.value );

	/**
	 * IDs of channels this install can actually enable, decided server-side in PHP
	 * (WP Dark Mode Ultimate extends this list via a filter when active). This is
	 * the entire mechanism behind the channel lock - see
	 * ai-docs/social-share-trialware-fix/05-how-it-works.md.
	 */
	const availableChannelIds = computed( () => window.wp_dark_mode_social_share.available_channel_ids || [] );

	const hasLockedChannels = computed( () => state.channels.some( ( channel ) => ! channel.enabled ) );

	const channels = computed( () => state.channels );

	const filteredChannels = computed( () => {
		const search = state.search_channels;

		if ( ! search ) {
			return ! state.showAllChannels ? channels.value.slice( 0, 10 ) : channels.value;
		}

		const filtered = channels.value.filter( ( channel ) => {
			const searchIn = [ channel.name.toLowerCase(), channel.id ];
			if ( channel.tags ) {
				searchIn.push( ...channel.tags );
			}
			return searchIn.some( ( tag ) => tag.includes( search.toLowerCase() ) );
		} );

		return ! state.showAllChannels ? filtered.slice( 0, 15 ) : filtered;
	} );

	const enabledChannels = computed( () => options.value.channels || [] );

	const enabledChannelsForPreview = computed( () => {
		if ( ! enabledChannels.value || ! options.value || typeof options.value.channel_visibility === 'undefined' ) {
			return [];
		}
		return enabledChannels.value.slice( 0, options.value.channel_visibility || 2 );
	} );

	function isTab( tab = 'channels' ) {
		return state.activeTab === tab;
	}

	const currentTab = computed( () => TABS.find( ( tab ) => isTab( tab.id ) ) );

	function setTab( tab ) {
		state.activeTab = tab;
		window.location.hash = tab;
	}

	function initTab() {
		if ( window.location.hash ) {
			const hash = window.location.hash.substr( 1 );
			if ( TABS.find( ( tab ) => tab.id === hash ) ) {
				setTab( hash );
			}
		}
	}

	function showPromo() {
		window.WPDarkModePromo?.show();
	}

	function isChannelEnabled( channelId ) {
		return enabledChannels.value.find( ( currentChannel ) => currentChannel.id === channelId );
	}

	function toggleChannel( channelId ) {
		const channel = state.channels.find( ( currentChannel ) => currentChannel.id === channelId );
		const enabled = [ ...( options.value.channels || [] ) ];
		const channelIndex = enabled.findIndex( ( currentChannel ) => currentChannel.id === channelId );

		if ( channelIndex < 0 ) {
			if ( ! channel.enabled ) {
				showPromo();
				return;
			}

			enabled.push( {
				id: channel.id,
				name: channel.name,
				visibility: { desktop: true, mobile: true },
			} );
		} else {
			enabled.splice( channelIndex, 1 );
		}

		options.value.channels = enabled;
	}

	function getIcon( channelId ) {
		const channel = channels.value.find( ( currentChannel ) => currentChannel.id === channelId );
		return channel?.svg || channel?.icon;
	}

	function handleDrag( event, channelId ) {
		event.preventDefault();

		if ( ! state.draggingChannel ) {
			return;
		}

		const list = options.value.channels || [];
		const draggingIndex = list.findIndex( ( c ) => c.id === state.draggingChannel );
		const targetIndex = list.findIndex( ( c ) => c.id === channelId );

		if ( draggingIndex === -1 || targetIndex === -1 ) {
			return;
		}

		const temp = list[ draggingIndex ];
		list[ draggingIndex ] = list[ targetIndex ];
		list[ targetIndex ] = temp;

		options.value.channels = list;
	}

	function handleDrop() {
		state.draggingChannel = null;
	}

	function initChannels() {
		const list = window.wp_dark_mode_social_share.channels;
		list.map( ( channel ) => {
			channel.class = channel.class || `_icon-${ channel.id }`;
			channel.enabled = availableChannelIds.value.includes( channel.id );
			return channel;
		} );
		state.channels = list || [];
	}

	function initPostTypes() {
		state.post_types = Object.values( window.wp_dark_mode_social_share.post_types ).filter(
			( postType ) => postType.id !== 'attachment'
		);
	}

	function coerceVisibility( visibility ) {
		if ( ! visibility || typeof visibility !== 'object' ) {
			return { desktop: true, mobile: true };
		}
		return {
			desktop: visibility.desktop === '1' || visibility.desktop === true || visibility.desktop === 1,
			mobile: visibility.mobile === '1' || visibility.mobile === true || visibility.mobile === 1,
		};
	}

	// Only these keys are genuine on/off flags stored as "1"/"0" strings. Numeric-count
	// keys (channel_visibility, button_template, minimum_share_count, maximum_click_count)
	// also happen to sometimes hold the string "0"/"1" as a real count, not a boolean -
	// coercing those to `false`/`true` blanked the "0" placeholder in the Minimum Share
	// Count field, since `false` renders as empty in a number input.
	const BOOLEAN_FLAG_KEYS = [ 'enable', 'button_spacing', 'show_total_share_count' ];

	function initOptions() {
		const optionKeys = Object.keys( window.wp_dark_mode_social_share.options );
		const optionValues = Object.values( window.wp_dark_mode_social_share.options ).map( ( value, index ) => {
			const key = optionKeys[ index ];

			if ( BOOLEAN_FLAG_KEYS.includes( key ) ) {
				if ( value === '1' || value === 1 ) return true;
				if ( value === '0' || value === 0 ) return false;
			}

			if ( key === 'channels' && Array.isArray( value ) ) {
				return value.map( ( channel ) => ( {
					...channel,
					visibility: coerceVisibility( channel.visibility ),
				} ) );
			}

			if ( typeof value === 'object' && value !== null ) {
				if ( 'mobile' in value ) value.mobile = value.mobile === '1';
				if ( 'desktop' in value ) value.desktop = value.desktop === '1';
				return value;
			}

			return value;
		} );

		const parsed = { enable: false };
		optionKeys.forEach( ( key, index ) => {
			parsed[ key ] = optionValues[ index ];
		} );

		state.noWatch = true;
		options.value = parsed;
		state.savedOptions = JSON.parse( JSON.stringify( parsed ) );
		state.noWatch = false;
	}

	function updatePreview() {
		document.documentElement.style.setProperty( '--wpdm-social-share-scale', options.value.button_size );
		document.documentElement.style.setProperty( '--wp-dark-social-share-scale', options.value.button_size );
	}

	function togglePostType( postType ) {
		if ( ! Array.isArray( options.value.post_types ) ) {
			options.value.post_types = [];
		}

		if ( options.value.post_types.includes( postType ) ) {
			options.value.post_types = options.value.post_types.filter( ( p ) => p !== postType );
		} else {
			options.value.post_types.push( postType );
		}
	}

	async function saveOptions( payload = null, silence = false ) {
		state.isChanged = false;

		const body = payload === null ? JSON.parse( JSON.stringify( options.value ) ) : payload;

		if ( ! silence ) {
			clearTimeout( state.savedTimer );
			state.saved = true;
			state.savedTimer = setTimeout( () => {
				state.saved = false;
			}, 2500 );
		}

		const response = await axios.post(
			window.wp_dark_mode_social_share?.ajax_url + '?action=wp_dark_social_share_save_options',
			{
				options: body,
				security_key: window.wp_dark_mode_social_share.security_key,
			}
		);

		if ( response.data.success ) {
			state.savedOptions = response.data.data;
			state.isChanged = false;
		}
	}

	async function saveOptionsButton() {
		await saveOptions( JSON.parse( JSON.stringify( options.value ) ) );
	}

	async function toggleSocialShare() {
		if ( options.value.saved === true ) {
			const savedOptions = JSON.parse( JSON.stringify( state.savedOptions ) );
			savedOptions.enable = Boolean( options.value.enable );

			state.noWatch = true;
			options.value = JSON.parse( JSON.stringify( savedOptions ) );
			state.noWatch = false;
			state.savedOptions = savedOptions;

			try {
				await saveOptions( savedOptions );
				state.isChanged = false;
			} catch ( error ) {
				console.error( 'Error saving options:', error );
				state.isChanged = true;
			}
		} else {
			options.value.saved = true;
			state.isChanged = true;
			state.noWatch = false;
		}
	}

	function randomNumber( from = 10, to = 100 ) {
		return Math.floor( Math.random() * ( to - from + 1 ) + from );
	}

	function isAIChannel( channelId ) {
		const channel = window.wp_dark_mode_social_share.channels.find( ( c ) => c.id === channelId );
		return channel && channel.type === 'ai_prompt';
	}

	function getDefaultPrompt( channelId = null ) {
		if ( channelId ) {
			const channel = window.wp_dark_mode_social_share.channels.find( ( c ) => c.id === channelId );
			if ( channel && channel.prompt ) {
				return channel.prompt;
			}
		}
		return t( 'default_ai_prompt' );
	}

	function getChannelPrompt( channelId ) {
		const userChannel = options.value.channels.find( ( c ) => c.id === channelId );
		if ( userChannel && userChannel.prompt ) {
			return userChannel.prompt;
		}
		return getDefaultPrompt( channelId );
	}

	function editPrompt( channel ) {
		state.promptModal.channel = channel;
		state.promptModal.prompt = getChannelPrompt( channel.id );
		state.promptModal.show = true;
	}

	function closePromptModal() {
		state.promptModal.show = false;
		state.promptModal.channel = null;
		state.promptModal.prompt = '';
	}

	function updateChannelPrompt() {
		if ( state.promptModal.channel ) {
			const idx = options.value.channels.findIndex( ( c ) => c.id === state.promptModal.channel.id );
			if ( idx >= 0 ) {
				options.value.channels[ idx ].prompt = state.promptModal.prompt;
			}
		}
	}

	function resetToDefault() {
		if ( state.promptModal.channel ) {
			const defaultPrompt = getDefaultPrompt( state.promptModal.channel.id );
			state.promptModal.prompt = defaultPrompt;

			const idx = options.value.channels.findIndex( ( c ) => c.id === state.promptModal.channel.id );
			if ( idx >= 0 ) {
				options.value.channels[ idx ].prompt = defaultPrompt;
			}
		}
	}

	function donePrompt() {
		updateChannelPrompt();
		closePromptModal();
	}

	function editableChannel( event ) {
		event.target.previousElementSibling?.focus();
	}

	function init() {
		initOptions();
		initTab();
		initChannels();
		initPostTypes();

		watch(
			options,
			() => {
				state.isChanged = ! state.noWatch;
			},
			{ deep: true }
		);
	}

	return {
		t,
		state,
		options,
		isUltimate,
		isPro,
		isFree,
		hasLockedChannels,
		availableChannelIds,
		channels,
		filteredChannels,
		enabledChannels,
		enabledChannelsForPreview,
		isTab,
		currentTab,
		setTab,
		showPromo,
		isChannelEnabled,
		toggleChannel,
		getIcon,
		handleDrag,
		handleDrop,
		togglePostType,
		updatePreview,
		saveOptions,
		saveOptionsButton,
		toggleSocialShare,
		randomNumber,
		isAIChannel,
		getChannelPrompt,
		editPrompt,
		closePromptModal,
		updateChannelPrompt,
		resetToDefault,
		donePrompt,
		editableChannel,
		init,
	};
} );
