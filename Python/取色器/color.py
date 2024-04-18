import colorsys


class Color:
    rgb = None
    hsl = None
    hex = None

    def __init__(self, rgb=None, hsl=None, hex=None):
        try:
            if rgb is not None and hsl is None and hex is None:
                hls = colorsys.rgb_to_hls(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)
                self.rgb = rgb
                self.hsl = (round(hls[0] * 360), round(hls[2] * 100), round(hls[1] * 100))
                self.hex = "#{0:02X}{1:02X}{2:02X}".format(*rgb)
            if rgb is None and hsl is not None and hex is None:
                _rgb = colorsys.hls_to_rgb(hsl[0] / 360, hsl[2] / 100, hsl[1] / 100)
                self.rgb = (int(_rgb[0] * 255), int(_rgb[1] * 255), int(_rgb[2] * 255))
                self.hsl = hsl
                self.hex = "#{0:02X}{1:02X}{2:02X}".format(*self.rgb)
            if rgb is None and hsl is None and hex is not None:
                self.rgb = (int(hex[1:3], 16), int(hex[3:5], 16), int(hex[5:7], 16))
                hls = colorsys.rgb_to_hls(self.rgb[0] / 255, self.rgb[1] / 255, self.rgb[2] / 255)
                self.hsl = (round(hls[0] * 360), round(hls[2] * 100), round(hls[1] * 100))
                self.hex = hex
        finally:
            pass
