#include <stdint.h>
#include <stdlib.h>
#include <emscripten/emscripten.h>

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

typedef struct {
  uint8_t r;
  uint8_t g;
  uint8_t b;
  uint8_t a;
} pixel_t;

EXTERN EMSCRIPTEN_KEEPALIVE pixel_t* init_pixels(int width, int height) {
  return (pixel_t*) malloc(width * height * sizeof(pixel_t));
}

EXTERN EMSCRIPTEN_KEEPALIVE pixel_t* create_color(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
  pixel_t* color = (pixel_t*) malloc(sizeof(pixel_t));
  color->r = r;
  color->g = g;
  color->b = b;
  color->a = a;
  return color;
}

EXTERN EMSCRIPTEN_KEEPALIVE void free_color(pixel_t* color) {
  free(color);
}

EXTERN EMSCRIPTEN_KEEPALIVE void draw(pixel_t* pixels, int width, int height, int x, int y, pixel_t* color) {
  if (x >= 0 && x < width && y >= 0 && y < height) {
    pixels[y * width + x] = *color;
  }
}
