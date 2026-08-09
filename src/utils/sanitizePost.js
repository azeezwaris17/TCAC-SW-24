const pick = (obj = {}, keys = []) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

export const sanitizePost = (post = {}) => {
  const content = post.content || {};
  let sanitizedContent = content;

  switch (post.postType) {
    case "Gallery":
      sanitizedContent = {
        ...pick(content, ["title", "subtitle"]),
        images: Array.isArray(content.images)
          ? content.images.map((img) => pick(img, ["url", "caption"]))
          : [],
      };
      break;

    case "Slider":
      sanitizedContent = {
        ...pick(content, [
          "sliderTitle",
          "showTitleBackgroundColor",
          "titleBackgroundColor",
          "showBackgroundColor",
          "backgroundColor",
          "imagesPerSlide",
        ]),
        slides: Array.isArray(content.slides)
          ? content.slides.map((slide) =>
              pick(slide, [
                "id",
                "image",
                "title",
                "subtitle",
                "showBackgroundColor",
                "backgroundColor",
                "showTitleTextColor",
                "titleTextColor",
                "showSubtitleTextColor",
                "subtitleTextColor",
              ])
            )
          : [],
      };
      break;

    case "Video Embed":
      sanitizedContent = pick(content, [
        "uploadType",
        "videoFile",
        "videoUrl",
        "caption",
        "showCustomStyling",
        "titleBackgroundColor",
        "titleTextColor",
      ]);
      break;

    case "Header and Paragraph":
      sanitizedContent = pick(content, ["title", "subtitle"]);
      break;

    case "Popout/Modal":
      sanitizedContent = pick(content, [
        "showDelay",
        "behavior",
        "size",
        "showCloseButton",
        "allowClickOutside",
        "autoCloseDelay",
        "body",
        "image",
        "video",
      ]);
      break;

    default:
      sanitizedContent = content || {};
      break;
  }

  return {
    ...post,
    content: sanitizedContent,
  };
};
