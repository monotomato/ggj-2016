function texturePackerTemplate (params) {
	var items = params.items,
		itemObj = { frames: {} },
		frames = itemObj.frames,
		item;

	if (items.length > 0) {
		item = items[0];
		itemObj.meta = {
			app: "spritejsonformat.js",
			image: item.image,
			format: 'RGBA8888',
			size: {
				w: item.total_width,
				h: item.total_height
			},
			scale: 1
		};
	}

	items.forEach(function (item) {
		frames[item.name] = {
			frame: { x: item.x, y: item.y, w: item.width, h: item.height },
			rotated: false,
			trimmed: false,
      duration: 100,
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: item.width,
				h: item.height
			},
			sourceSize: {
				w: item.width,
				h: item.height
			}
		};
	});

	return JSON.stringify(itemObj, null, 4);
}

module.exports = texturePackerTemplate;
