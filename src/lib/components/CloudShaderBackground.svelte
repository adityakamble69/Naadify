<script>
	import { onMount } from 'svelte';

	let canvasEl;
	let raf;
	let gl;
	let ctxLost = false;

	const VERT_SRC = `#version 300 es
		layout(location = 0) in vec2 a_pos;
		void main() {
			gl_Position = vec4(a_pos, 0.0, 1.0);
		}
	`;

	// Domain-warped FBM cloud field, tinted to Naadify's dark-navy / accent-blue
	// palette (#070A12 base, #1959C9 sky, #3FA0FF accent, #6FC3FF glow).
	const FRAG_SRC = `#version 300 es
		precision highp float;
		out vec4 fragColor;
		uniform vec2 u_resolution;
		uniform float u_time;

		float hash(vec2 p) {
			p = fract(p * vec2(123.34, 456.21));
			p += dot(p, p + 45.32);
			return fract(p.x * p.y);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);
			float a = hash(i);
			float b = hash(i + vec2(1.0, 0.0));
			float c = hash(i + vec2(0.0, 1.0));
			float d = hash(i + vec2(1.0, 1.0));
			return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
		}

		float fbm(vec2 p) {
			float value = 0.0;
			float amp = 0.5;
			for (int i = 0; i < 6; i++) {
				value += amp * noise(p);
				p *= 2.02;
				amp *= 0.52;
			}
			return value;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / u_resolution.xy;
			vec2 p = uv;
			p.x *= u_resolution.x / u_resolution.y;

			float t = u_time * 0.035;

			// domain warp for soft, drifting cloud shapes
			vec2 warp = vec2(fbm(p * 1.4 + vec2(t, -t * 0.6)), fbm(p * 1.4 + vec2(-t * 0.5, t)));
			float clouds = fbm(p * 2.1 + warp * 1.1 + vec2(t * 0.4, t * 0.15));
			clouds = smoothstep(0.25, 0.85, clouds);

			// second thinner layer drifting the other way for depth
			float wisps = fbm(p * 3.6 - warp * 0.8 - vec2(t * 0.25, -t * 0.1));
			wisps = smoothstep(0.45, 0.9, wisps) * 0.5;

			vec3 base   = vec3(0.027, 0.039, 0.071);  // #070A12
			vec3 sky    = vec3(0.098, 0.349, 0.788);  // #1959C9
			vec3 accent = vec3(0.247, 0.627, 1.0);    // #3FA0FF
			vec3 glow   = vec3(0.435, 0.765, 1.0);    // #6FC3FF

			// vertical gradient so it stays darkest near the player UI at top/bottom
			float vgrad = smoothstep(0.0, 1.0, uv.y);
			vec3 col = mix(base, base * 1.6 + sky * 0.12, vgrad);

			col = mix(col, sky * 0.55, clouds * 0.6);
			col += accent * clouds * 0.22;
			col += glow * wisps * 0.16;

			// gentle vignette to keep edges dark, matching the old overlay
			float vig = smoothstep(1.05, 0.35, length(uv - 0.5));
			col *= mix(0.72, 1.0, vig);

			fragColor = vec4(col, 1.0);
		}
	`;

	function compile(type, src) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('Shader compile error:', gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	function resize() {
		if (!canvasEl) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const w = Math.floor(canvasEl.clientWidth * dpr);
		const h = Math.floor(canvasEl.clientHeight * dpr);
		if (canvasEl.width !== w || canvasEl.height !== h) {
			canvasEl.width = w;
			canvasEl.height = h;
			if (gl) gl.viewport(0, 0, w, h);
		}
	}

	onMount(() => {
		gl = canvasEl.getContext('webgl2', { antialias: false, powerPreference: 'low-power' });
		if (!gl) {
			ctxLost = true;
			return;
		}

		const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
		const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
		if (!vs || !fs) {
			ctxLost = true;
			return;
		}

		const program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Program link error:', gl.getProgramInfoLog(program));
			ctxLost = true;
			return;
		}
		gl.useProgram(program);

		// full-screen triangle (no fullscreen quad needed)
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 3, -1, -1, 3]),
			gl.STATIC_DRAW
		);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

		const u_resolution = gl.getUniformLocation(program, 'u_resolution');
		const u_time = gl.getUniformLocation(program, 'u_time');

		resize();
		window.addEventListener('resize', resize);

		let paused = false;
		function handleVisibility() {
			paused = document.hidden;
		}
		document.addEventListener('visibilitychange', handleVisibility);

		const start = performance.now();
		function frame(now) {
			if (!paused) {
				resize();
				gl.uniform2f(u_resolution, canvasEl.width, canvasEl.height);
				gl.uniform1f(u_time, (now - start) / 1000);
				gl.drawArrays(gl.TRIANGLES, 0, 3);
			}
			raf = requestAnimationFrame(frame);
		}
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			document.removeEventListener('visibilitychange', handleVisibility);
		};
	});
</script>

<div class="absolute inset-0 bg-base">
	{#if !ctxLost}
		<canvas bind:this={canvasEl} class="absolute inset-0 w-full h-full"></canvas>
	{/if}
</div>
