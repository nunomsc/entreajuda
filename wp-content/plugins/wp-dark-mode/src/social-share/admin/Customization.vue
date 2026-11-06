<script setup>
import { useSocialShareStore, BUTTON_POSITIONS, BUTTON_ALIGNMENTS, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_LABELS, DEVICES } from './store';

const store = useSocialShareStore();

const t = ( key ) => window.wp_dark_mode_admin_json?.strings?.[ key ] || key;
</script>

<template>
	<section class="w-full max-md p-3 max-w-md" v-show="store.isTab( 'customization' )">
		<div class="transition duration-150" :class="{ 'opacity-40 pointer-events-none': ! store.options.enable }">
			<!-- Inline button templates -->
			<div class="mb-8">
				<label for="inline_button_templates" class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'inline_button_template' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'inline_button_template_tooltip' )"></span>
				</label>

				<div class="grid grid-cols-1 gap-3 w-full">
					<div
						v-for="templateIndex in 2"
						:key="templateIndex"
						class="flex items-center gap-2 cursor-pointer group relative"
						@click.prevent="templateIndex > 1 && store.isFree ? store.showPromo() : ( store.options.button_template = templateIndex )"
					>
						<!-- template selector -->
						<div
							class="w-4 h-4 text-white ring-1 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:ring-blue-500 transition duration-150"
							:class="{ 'bg-blue-500 ring-blue-500': templateIndex == store.options.button_template, 'bg-slate-100 ring-gray-200': templateIndex != store.options.button_template }"
						>
							<svg
								v-show="templateIndex < 2 || ! store.isFree"
								xmlns="http://www.w3.org/2000/svg"
								class="group-hover:opacity-100 group-hover:scale-100 transition duration-200 fa fa-check mt-0.5 fill-current text-white"
								:class="{ 'opacity-100': templateIndex == store.options.button_template, 'opacity-0 scale-0': templateIndex != store.options.button_template }"
								viewBox="0 0 16 16"
							>
								<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
							</svg>
							<svg
								v-show="templateIndex > 1 && store.isFree"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 64 64"
								class="fill-current w-4 ring-purple-500 opacity-100 scale-100 text-purple-500 group-hover:text-white"
							>
								<path d="M 32 9 C 24.832 9 19 14.832 19 22 L 19 27.347656 C 16.670659 28.171862 15 30.388126 15 33 L 15 49 C 15 52.314 17.686 55 21 55 L 43 55 C 46.314 55 49 52.314 49 49 L 49 33 C 49 30.388126 47.329341 28.171862 45 27.347656 L 45 22 C 45 14.832 39.168 9 32 9 z M 32 13 C 36.963 13 41 17.038 41 22 L 41 27 L 23 27 L 23 22 C 23 17.038 27.037 13 32 13 z" />
							</svg>
						</div>
						<!-- template display -->
						<div class="w-full _social-share-container _fixed-size" :class="{ 'group-hover:opacity-0': store.isFree && templateIndex > 1 }">
							<div
								class="_channels-container _demo _spaced _both-label _channel-template-1 _spaced _rounded _no-wrap"
								:class="`_channel-template-${ templateIndex }`"
							>
								<div class="_channels _no-wrap transition duration-100">
									<!-- Dummy channel icons -->
									<div
										v-for="channelId in [ 'facebook', 'twitter' ]"
										:key="channelId"
										class="_channel transition duration-100"
										:class="[ `_icon-${ channelId }` ]"
									>
										<span class="_channel-icon"><span v-html="store.getIcon( channelId )"></span></span>
										<div class="_channel-label">
											<span class="_channel-name"><span class="capitalize">{{ channelId }}</span></span>
											<span class="_channel-count transition duration-100">
												<span>{{ templateIndex > 1 ? store.randomNumber( 60, 80 ) : store.randomNumber( 1, 50 ) }}</span>
											</span>
										</div>
									</div>

									<!-- more button -->
									<div class="_channel transition duration-100 _icon-light">
										<span class="_channel-icon">
											<span>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
													<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
												</svg>
											</span>
										</span>
										<div class="channel-label pr-3" :class="{ 'pl-2': templateIndex == 1 }">
											<span class="_channel-name">
												<span class="capitalize">{{ t( 'more' ) }}</span>
											</span>
											<span></span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- overlay -->
						<wp-dark-upgrade
							v-show="templateIndex > 1 && store.isFree"
							switch="false"
							border="false"
							class="ml-6"
							overlay="false"
							align="left"
						></wp-dark-upgrade>
					</div>
				</div>
			</div>

			<!-- Share label -->
			<div class="mb-8">
				<label for="share_label" class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'share_label' ) }}
					<span v-tooltip class="wpdarkmode-tooltip" :title="t( 'share_label_tooltip' )"></span>
				</label>
				<div>
					<input
						id="share_label"
						v-model="store.options.share_via_label"
						type="text"
						class="input-text"
						:placeholder="t( 'share_label_placeholder' )"
					/>
				</div>
			</div>

			<!-- Button position -->
			<div class="mb-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'button_position' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'button_position_tooltip' )"></span>
				</label>
				<div class="wp-dark-button-group">
					<label
						v-for="( label, key ) in BUTTON_POSITIONS"
						:key="key"
						class="wp-dark-button"
						:class="{ active: key === store.options.button_position }"
						@click.prevent="store.options.button_position = key"
					>{{ label }}</label>
				</div>
			</div>

			<!-- Button alignment -->
			<div class="mb-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'button_alignment' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'button_alignment_tooltip' )"></span>
				</label>
				<div class="wp-dark-button-group">
					<label
						v-for="( label, key ) in BUTTON_ALIGNMENTS"
						:key="key"
						class="wp-dark-button"
						:title="label"
						:class="key === store.options.button_alignment ? 'active' : []"
						@click.prevent="store.options.button_alignment = key"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-5" viewBox="0 0 16 16">
							<path v-show="key === 'left'" fill-rule="evenodd" d="M1.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z" />
							<path v-show="key === 'left'" d="M3 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
							<path v-show="key === 'center'" d="M8 1a.5.5 0 0 1 .5.5V6h-1V1.5A.5.5 0 0 1 8 1zm0 14a.5.5 0 0 1-.5-.5V10h1v4.5a.5.5 0 0 1-.5.5zM2 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" />
							<path v-show="key === 'right'" fill-rule="evenodd" d="M14.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z" />
							<path v-show="key === 'right'" d="M13 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
							<path v-show="key === 'stretch'" d="M13 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
						</svg>
					</label>
				</div>
			</div>

			<!-- Button shape -->
			<div class="mb-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'button_shape' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'button_shape_tooltip' )"></span>
				</label>
				<div class="wp-dark-button-group">
					<label
						v-for="( label, key ) in BUTTON_SHAPES"
						:key="key"
						class="wp-dark-button"
						:class="key === store.options.button_shape ? [ 'active' ] : []"
						@click.prevent="store.options.button_shape = key"
					>{{ label }}</label>
				</div>
			</div>

			<!-- Button size -->
			<div class="mb-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'button_size' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'button_size_tooltip' )"></span>
				</label>
				<div class="wp-dark-button-group">
					<label
						v-for="( label, key ) in BUTTON_SIZES"
						:key="key"
						class="wp-dark-button"
						:class="key === store.options.button_size ? [ 'active' ] : []"
						@click.prevent="store.options.button_size = key; store.updatePreview()"
					>{{ label }}</label>
				</div>
			</div>

			<!-- Button labels -->
			<div class="mb-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'button_label' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'button_label_tooltip' )"></span>
				</label>
				<div class="wp-dark-button-group">
					<label
						v-for="( label, key ) in BUTTON_LABELS"
						:key="key"
						class="wp-dark-button"
						:class="key === store.options.button_label ? 'active' : []"
						@click.prevent="store.options.button_label = key"
					>{{ label }}</label>
				</div>
			</div>

			<!-- Button responsiveness -->
			<div class="mb-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'hide_buttons_on' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'hide_buttons_on_tooltip' )"></span>
					<span v-show="! store.isPro" class="badge-ultimate" style="cursor: pointer" @click="store.showPromo">{{ t( 'ultimate' ) }}</span>
				</label>
				<div class="group relative">
					<div class="wp-dark-button-group" :class="{ 'group-hover:opacity-0': store.isFree }">
						<label
							v-for="( label, key ) in DEVICES"
							:key="key"
							class="wp-dark-button"
							:title="label.name"
							:class="{ active: store.options.hide_button_on[ key ] === true }"
							@click.prevent="! store.isFree ? ( store.options.hide_button_on[ key ] = ! store.options.hide_button_on[ key ] ) : store.showPromo()"
						><span v-html="label.icon"></span> {{ label.name }}</label>
					</div>
					<wp-dark-upgrade
						v-show="store.isFree"
						switch="false"
						overlay="false"
						border="false"
						align="left"
						@click.prevent="store.showPromo"
					></wp-dark-upgrade>
				</div>
			</div>

			<!-- Display button in post types -->
			<div class="mb-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'display_buttons_on' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'display_buttons_on_tooltip' )"></span>
					<span v-show="! store.isPro" class="badge-ultimate" style="cursor: pointer" @click="store.showPromo">{{ t( 'ultimate' ) }}</span>
				</label>
				<div class="wp-dark-button-group gap-1 flex-wrap">
					<label
						v-for="post_type in store.state.post_types"
						:key="post_type.id"
						class="wp-dark-button rounded-sm relative group"
						:title="post_type.name"
						:class="[ store.options.post_types.includes( post_type.id ) ? 'active' : '' ]"
						@click.prevent="[ 'post', 'page' ].includes( post_type.id ) || ! store.isFree ? store.togglePostType( post_type.id ) : store.showPromo()"
					>
						<svg
							v-show="[ 'post', 'page' ].includes( post_type.id ) || store.isPro"
							xmlns="http://www.w3.org/2000/svg"
							class="fill-current w-3"
							:class="store.options.post_types.includes( post_type.id ) ? '' : 'opacity-40'"
							viewBox="0 0 16 16"
						>
							<path
								v-show="! store.options.post_types.includes( post_type.id )"
								d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
							/>
							<path
								v-show="store.options.post_types.includes( post_type.id )"
								d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
							/>
							<path
								v-show="store.options.post_types.includes( post_type.id )"
								d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"
							/>
						</svg>
						<svg
							v-show="! [ 'post', 'page' ].includes( post_type.id ) && store.isFree"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 64 64"
							class="fill-current w-4 ring-purple-500 opacity-100 scale-100 text-purple-500"
						>
							<path d="M 32 9 C 24.832 9 19 14.832 19 22 L 19 27.347656 C 16.670659 28.171862 15 30.388126 15 33 L 15 49 C 15 52.314 17.686 55 21 55 L 43 55 C 46.314 55 49 52.314 49 49 L 49 33 C 49 30.388126 47.329341 28.171862 45 27.347656 L 45 22 C 45 14.832 39.168 9 32 9 z M 32 13 C 36.963 13 41 17.038 41 22 L 41 27 L 23 27 L 23 22 C 23 17.038 27.037 13 32 13 z" />
						</svg>
						<span>{{ store.t( post_type.id ) || post_type.name }}</span>
					</label>
				</div>
			</div>

			<!-- Button spacing -->
			<div class="mb-6 flex items-center gap-2 justify-between" @click="store.isFree ? store.showPromo : ''">
				<label for="button_spacing" class="font-semibold text-sm text-slate-700 cursor-pointer flex gap-1">
					{{ t( 'button_spacing' ) }} <span v-tooltip class="wpdarkmode-tooltip" :title="t( 'button_spacing_tooltip' )"></span>
					<span v-show="! store.isPro" class="badge-ultimate" style="cursor: pointer" @click="store.showPromo">{{ t( 'ultimate' ) }}</span>
				</label>
				<label for="button_spacing" class="_switcher group relative">
					<input id="button_spacing" v-model="store.options.button_spacing" type="checkbox" :disabled="store.isFree" />
					<span></span>
					<wp-dark-upgrade
						v-show="store.isFree"
						switch="true"
						overlay="false"
						border="false"
						align="right"
						text="Upgrade Now"
						@click.prevent="store.showPromo"
					></wp-dark-upgrade>
				</label>
			</div>

			<!-- Total Share -->
			<div class="flex items-center justify-between mb-6" @click="store.isFree ? store.showPromo : ''">
				<label for="total_share" class="font-semibold text-sm text-slate-700 cursor-pointer w-48 flex gap-1">
					{{ t( 'total_shares' ) }}
					<span v-tooltip class="wpdarkmode-tooltip" :title="t( 'total_shares_tooltip' )"></span>
					<span v-show="! store.isPro" class="badge-ultimate" style="cursor: pointer" @click="store.showPromo">{{ t( 'ultimate' ) }}</span>
				</label>
				<label for="total_share" class="_switcher group relative">
					<input id="total_share" v-model="store.options.show_total_share_count" type="checkbox" :class="{ 'group-hover:opacity-0': store.isFree }" :disabled="store.isFree" />
					<span></span>
					<wp-dark-upgrade
						v-show="store.isFree"
						switch="true"
						overlay="false"
						border="false"
						align="right"
						text="Upgrade Now"
						@click.prevent="store.showPromo"
					></wp-dark-upgrade>
				</label>
			</div>
			<div class="mb-6">
				<label for="minimum_share" class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'minimum_share_count' ) }}
					<span v-tooltip class="wpdarkmode-tooltip" :title="t( 'minimum_share_count_tooltip' )"></span>
					<span v-show="! store.isUltimate" class="badge-ultimate" style="cursor: pointer" @click="store.showPromo">{{ t( 'ultimate' ) }}</span>
				</label>
				<div class="w-full group relative">
					<input id="minimum_share" v-model="store.options.minimum_share_count" type="number" min="0" class="input-text text-sm" :class="{ 'group-hover:opacity-0': ! store.isUltimate }" :disabled="! store.isUltimate" />
					<wp-dark-upgrade
						v-show="! store.isUltimate"
						switch="false"
						overlay="false"
						align="left"
						border="false"
						@click.prevent="store.showPromo"
					></wp-dark-upgrade>
				</div>
			</div>

			<!-- Maximum share count per visitor -->
			<div class="mb-6">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'maximum_share_click' ) }}
					<span v-tooltip class="wpdarkmode-tooltip" :title="t( 'maximum_share_click_tooltip' )"></span>
					<span v-show="! store.isUltimate" class="badge-ultimate" style="cursor: pointer" @click="store.showPromo">{{ t( 'ultimate' ) }}</span>
				</label>
				<div class="w-full group relative">
					<input v-model="store.options.maximum_click_count" type="number" min="1" max="7" class="input-text text-sm" :class="{ 'group-hover:opacity-0': ! store.isUltimate }" :disabled="! store.isUltimate" />
					<wp-dark-upgrade
						v-show="! store.isUltimate"
						switch="false"
						overlay="false"
						align="left"
						border="false"
						@click.prevent="store.showPromo"
					></wp-dark-upgrade>
				</div>
			</div>
			<!-- Show first N buttons -->
			<div class="mb-6">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-1">
					{{ t( 'channel_visibility_count' ) }}
					<span v-tooltip class="wpdarkmode-tooltip" :title="t( 'channel_visibility_count_tooltip' )"></span>
					<span v-show="! store.isUltimate" class="badge-ultimate" style="cursor: pointer" @click="store.showPromo">{{ t( 'ultimate' ) }}</span>
				</label>
				<div class="w-full group relative">
					<input v-model="store.options.channel_visibility" type="number" min="1" max="7" class="input-text text-sm" :class="{ 'group-hover:opacity-0': ! store.isUltimate }" :disabled="! store.isUltimate" />
					<wp-dark-upgrade
						v-show="! store.isUltimate"
						switch="false"
						overlay="false"
						align="left"
						border="false"
						@click.prevent="store.showPromo"
					></wp-dark-upgrade>
				</div>
			</div>
		</div>
	</section>
</template>
