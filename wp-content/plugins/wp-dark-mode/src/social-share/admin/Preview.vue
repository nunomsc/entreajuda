<script setup>
import { useSocialShareStore } from './store';

const store = useSocialShareStore();

const t = ( key ) => window.wp_dark_mode_admin_json?.strings?.[ key ] || key;
</script>

<template>
	<div v-show="store.options.enable === true" class="_preview-section w-full p-4 rounded-sm transition duration-75 relative">
		<div class="w-full sm:sticky z-0 sm:top-40 flex flex-col gap-2 items-center justify-center">
			<div class="w-full flex items-center justify-center">
				<!-- channel icon preview -->
				<div v-show="! store.isTab( 'social-meta' )" class="bg-slate-100 p-3 rounded-md shadow w-full border border-slate-200">
					<span class="text-sm font-semibold uppercase text-slate-700">{{ t( 'preview' ) }}</span>

					<!-- skeleton -->
					<div class="flex items-center justify-between gap-2 mb-2">
						<div class="h-8 w-full bg-slate-300 rounded-md"></div>
					</div>

					<!-- preview element -->
					<div v-for="index in ( store.options.button_position === 'both' ? 2 : 1 )" :key="index" class="w-full">
						<!-- skeleton -->
						<div
							v-show="index === 1 && ( store.options.button_position === 'below' || store.options.button_position === 'both' )"
							class="flex flex-col gap-2 w-full"
						>
							<div class="flex items-center justify-between gap-2">
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-1/4 bg-slate-300 rounded-md"></div>
							</div>
							<div class="flex items-center w-2/3 justify-between gap-2">
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-2/3 bg-slate-300 rounded-md"></div>
							</div>
						</div>

						<section
							v-show="store.options.enable === true"
							class="my-6 _social-share-container"
							:class="{
								'opacity-50 pointer-events-none': ! store.options.enable,
								'_align-left': store.options.button_alignment === 'left',
								'_align-center': store.options.button_alignment === 'center',
								'_align-right': store.options.button_alignment === 'right',
								'_align-stretch': store.options.button_alignment === 'stretch',
							}"
						>
							<!-- Share label -->
							<span
								v-show="store.options.share_via_label"
								v-editable="store.options.share_via_label"
								class="_share-label focus:border-0 focus:outline-none focus:ring focus:ring-blue-500"
								contenteditable="true"
								@input="store.options.share_via_label = $event.target.innerText"
							></span>

							<div
								class="_channels-container _channel-animation-1"
								:class="{
									_spaced: store.options.button_spacing,
									'_no-spaced': ! store.options.button_spacing,
									_rounded: store.options.button_shape === 'rounded',
									_circle: store.options.button_shape === 'circle',
									_rectangular: store.options.button_shape === 'rectangular',
									_slanted: store.options.button_shape === 'slanted',
									'_channel-template-2': store.options.button_template == '2',
									'_both-label': store.options.button_label === 'both',
								}"
							>
								<!-- total share -->
								<div v-if="store.options.show_total_share_count === true" class="_total-share">
									<div class="_total-share-count">
										<span>{{ store.randomNumber( 100, 200 ) }}</span>
										<span
											class="_wp-dark-social-shares-text focus:outline-none focus:border-0 focus:ring focus:ring-blue-500 transition duration-75"
											v-editable="store.options.shares_label || store.t( 'share' )"
											contenteditable="true"
											@input="store.options.shares_label = $event.target.innerText"
										></span>
									</div>
								</div>

								<div class="_channels transition duration-75">
									<!-- Share Icons -->
									<div
										v-for="channel in store.enabledChannelsForPreview"
										:key="channel.id"
										class="_channel transition duration-75"
										:class="[ `_icon-${ channel.id }` ]"
									>
										<span class="_channel-icon">
											<span v-html="store.getIcon( channel.id )"></span>
										</span>
										<div class="_channel-label" v-show="store.options.button_label !== 'none'">
											<span class="_channel-name" v-show="[ 'channel_label', 'both' ].includes( store.options.button_label )">
												<span
													v-editable="channel.name"
													class="transition duration-75 focus:border-0 focus:outline-none"
													contenteditable="true"
													@input="channel.name = $event.target.innerText"
												></span>
											</span>
											<span class="_channel-count transition duration-75" v-show="[ 'share_count', 'both' ].includes( store.options.button_label )">
												<span>{{ store.options.button_template > 1 ? store.randomNumber( 60, 80 ) : store.randomNumber( 1, 50 ) }}</span>
											</span>
										</div>
										<span class="_channel-overlay"></span>
									</div>

									<div
										v-if="store.enabledChannelsForPreview.length < store.enabledChannels.length"
										class="_channel transition duration-75 _icon-light _icon-more"
									>
										<span class="_channel-icon">
											<span>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
													<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
												</svg>
											</span>
										</span>
										<div class="_channel-label">
											<span
												v-editable="store.options.more_label"
												class="_channel-name transition duration-75 focus:border-0 focus:outline-none"
												contenteditable="true"
												@input="store.options.more_label = $event.target.textContent"
											></span>
											<span></span>
										</div>
										<span class="_channel-overlay"></span>
									</div>
								</div>
							</div>
						</section>

						<!-- skeleton -->
						<div
							v-show="index === 1 && ( store.options.button_position === 'above' || store.options.button_position === 'both' )"
							class="flex flex-col gap-2 w-full"
						>
							<div class="flex items-center justify-between gap-2">
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-1/4 bg-slate-300 rounded-md"></div>
							</div>
							<div class="flex items-center w-2/3 justify-between gap-2">
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-full bg-slate-300 rounded-md"></div>
								<div class="h-7 w-2/3 bg-slate-300 rounded-md"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Save buttons -->
			<div class="flex justify-end gap-2 mt-2">
				<button
					type="button"
					class="px-4 py-2 rounded-sm text-sm transition duration-75"
					:class="{
						'bg-green-500 hover:bg-green-600 text-white pl-2': store.state.isChanged,
						'bg-slate-200 cursor-not-allowed text-slate-500 pointer-events-none': ! store.state.isChanged,
					}"
					@click.prevent="store.saveOptionsButton()"
				>
					<span v-if="store.state.isChanged" class="flex items-center justify-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-5" viewBox="0 0 16 16">
							<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
						</svg>
						{{ t( 'save_publish' ) }}
					</span>

					<span v-else-if="! store.state.isChanged && store.options.enable" class="flex items-center justify-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-5" viewBox="0 96 960 960" width="48">
							<path d="M294 814 70 590l43-43 181 181 43 43-43 43Zm170 0L240 590l43-43 181 181 384-384 43 43-427 427Zm0-170-43-43 257-257 43 43-257 257Z" />
						</svg>
						{{ t( 'published' ) }}
					</span>

					<span v-else>{{ t( 'saved' ) }}</span>
				</button>
			</div>
		</div>
	</div>
</template>
