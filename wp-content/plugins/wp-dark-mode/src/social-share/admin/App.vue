<script setup>
import { onMounted } from 'vue';
import { useSocialShareStore } from './store';
import Sidebar from './Sidebar.vue';
import Channels from './Channels.vue';
import Customization from './Customization.vue';
import Preview from './Preview.vue';
import Loader from './Loader.vue';

const store = useSocialShareStore();

const t = ( key ) => window.wp_dark_mode_admin_json?.strings?.[ key ] || key;

// Populate options/channels before the first render - child components (Customization,
// Channels) read store.options.* directly in their templates and must not see the bare
// `{ enable: false }` initial ref value. Running this in onMounted is too late: Vue
// mounts children before the parent's onMounted fires.
store.init();

onMounted( () => {
	// Hide skeleton loader, same 1.2s delay as the original Alpine build.
	setTimeout( () => {
		const loader = document.getElementById( 'wp-dark-social-share-loader' );
		if ( loader ) {
			loader.style.display = 'none';
		}
	}, 1200 );
} );
</script>

<template>
	<div class="wrap wpdarkmode-section wpdarkmode-social-share" tabindex="0">
		<!-- header -->
		<h3 class="text-xl font-medium mb-4">{{ t( 'social_share_inline_button' ) }}</h3>

		<!-- body -->
		<div class="flex flex-col gap-2 border border-gray-300 bg-white relative">
			<!-- Save toast -->
			<div
				v-if="store.state.saved === true"
				v-show="store.state.saved"
				class="main-content-toast fixed right-3 top-14 flex items-center justify-center px-3 py-2.5 gap-2 bg-white z-[999999] rounded-xl shadow-xl"
			>
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M10.9996 21.3996C16.7434 21.3996 21.3996 16.7434 21.3996 10.9996C21.3996 5.25585 16.7434 0.599609 10.9996 0.599609C5.25585 0.599609 0.599609 5.25585 0.599609 10.9996C0.599609 16.7434 5.25585 21.3996 10.9996 21.3996ZM15.8188 9.31885C16.3265 8.81117 16.3265 7.98805 15.8188 7.48037C15.3112 6.97269 14.4881 6.97269 13.9804 7.48037L9.69961 11.7611L8.01885 10.0804C7.51117 9.57269 6.68805 9.57269 6.18037 10.0804C5.67269 10.5881 5.67269 11.4112 6.18037 11.9188L8.78037 14.5188C9.28805 15.0265 10.1112 15.0265 10.6188 14.5188L15.8188 9.31885Z"
						fill="#34D399"
					/>
				</svg>

				<span class="text-sm text-[#0F172A]">{{ t( 'saved_successfully' ) }}</span>

				<a
					class="relative right-auto top-auto z-10 w-6 h-6 inline-flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-700 transition outline-none"
					@click.prevent="store.state.saved = false"
				>
					<svg class="w-2.5" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L6 4.58579L10.2929 0.292893C10.6834 -0.0976311 11.3166 -0.0976311 11.7071 0.292893C12.0976 0.683417 12.0976 1.31658 11.7071 1.70711L7.41421 6L11.7071 10.2929C12.0976 10.6834 12.0976 11.3166 11.7071 11.7071C11.3166 12.0976 10.6834 12.0976 10.2929 11.7071L6 7.41421L1.70711 11.7071C1.31658 12.0976 0.683417 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
							fill="currentColor"
						/>
					</svg>
				</a>
			</div>

			<Loader />
			<Sidebar />

			<!-- content -->
			<section class="w-full flex flex-col md:flex-row">
				<div class="_content-section">
					<Channels />
					<Customization />
				</div>

				<Preview />
			</section>
			<!-- content end -->
		</div>
	</div>
</template>
