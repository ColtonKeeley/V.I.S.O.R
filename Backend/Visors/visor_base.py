from abc import ABC, abstractmethod
import os


class BaseVisor(ABC):
    """Abstract base for all V.I.S.O.R. visors.

    Subclasses MUST define the following class-level metadata so the
    framework can auto-discover and present them in the UI:

        VISOR_ID         – unique slug, e.g. "email"
        VISOR_NAME       – human-readable name, e.g. "Email Visor"
        DESCRIPTION      – one-line description
        FILE_EXTENSIONS  – list of handled extensions, e.g. [".eml"]
        ICON             – lucide icon name for the frontend, e.g. "mail"
    """

    VISOR_ID: str = ""
    VISOR_NAME: str = ""
    DESCRIPTION: str = ""
    FILE_EXTENSIONS: list[str] = []
    ICON: str = "folder-open"

    def __init__(self, source_path):
        self.source_path = os.path.abspath(source_path)
        self.base_dir = os.path.dirname(self.source_path)
        self.name = self.VISOR_NAME or "Base Visor"

    @classmethod
    def metadata(cls) -> dict:
        """Return a JSON-serialisable dict describing this visor."""
        return {
            "id": cls.VISOR_ID,
            "name": cls.VISOR_NAME,
            "description": cls.DESCRIPTION,
            "file_extensions": cls.FILE_EXTENSIONS,
            "icon": cls.ICON,
        }

    @abstractmethod
    def render(self, output_path):
        """Must be implemented by child (e.g. EmailVisor, PDFVisor)"""
        pass

    @abstractmethod
    def get_labels(self):
        """Extract ground-truth labels from the raw source"""
        pass

    @abstractmethod
    def run(self):
        pass

    def save_metadata(self, data):
        """A common utility for all visors"""
        print(f"Saving metadata to {self.base_dir}")
        # common saving logic here
