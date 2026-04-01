import sys
import os
from email_scrn import parse_eml_to_html, take_screenshot

# Add project root to path so we can import visor_base
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from visor_base import BaseVisor


class EmailVisor(BaseVisor):

    VISOR_ID = "ckemail"
    VISOR_NAME = "CKEmail"
    DESCRIPTION = "Displays .eml files for classification with built in click-to-raw support"
    FILE_EXTENSIONS = [".eml"]
    ICON = "mail"

    def __init__(self, source_path):
        super().__init__(source_path)

    def render(self, output_path):
        print(f"Rendering email from {self.source_path}")

    def get_labels(self):
        return {"type": "email"}

    def run(self):
        return


if __name__ == "__main__":
    visor = EmailVisor("./test.eml")
    visor.run()
