from pathlib import Path

module_path = Path(__file__).parent
root_path = module_path.parent
templates_path = module_path.joinpath("web", "templates")
static_path = module_path.joinpath("web", "static")

alembic_ini_path = root_path.joinpath("alembic.ini")
