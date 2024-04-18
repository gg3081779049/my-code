from PIL import ImageColor


class Font:
    color = None
    underline = False
    bold = False
    italic = False

    def __init__(self, color, underline=False, bold=False, italic=False):
        self.color = color
        self.underline = underline
        self.bold = bold
        self.italic = italic

    def getText(self, text):
        c = ImageColor.getrgb(self.color)
        rgb_code = "\u001B[38;2;" + str(c[0]) + ";" + str(c[1]) + ";" + str(c[2]) + "m"
        underline_code = "\u001B[4m" if self.underline else ""
        bold_code = "\u001B[1m" if self.bold else ""
        italic_code = "\u001B[3m" if self.italic else ""
        return rgb_code + underline_code + bold_code + italic_code + text + "\u001B[0m"

    def __str__(self):
        return self.getText(str({
            "color": self.color,
            "underline": self.underline,
            "bold": self.bold,
            "italic": self.italic
        }))
