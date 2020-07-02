from typing import Union
from notequalia.lexicon.merriam_webster.models import (
    EntryMetadata,
    ThesaurusDefinition,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/elated.json")
def test_adjective_verb_elated_collegiate_definition(
    fixture: Union[dict, list]
):
    ("adjective + verb 'elated' - Collegiate Data-modeling>")

    # Given a two definitions of "elated"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    adjective, verb = definitions

    # Then their type matches
    adjective.functional_label.should.equal("adjective")
    verb.functional_label.should.equal("verb")

    adjective.to_dict().should.equal(
        {'functional_label': 'adjective', 'headword': 'elat*ed', 'offensive': False, 'pronounciations': [{'audio_url': 'https://media.merriam-webster.com/audio/prons/en/US/wav/e/elate01m.mp3', 'default': 'i-ˈlā-təd'}], 'short': ['marked by high spirits : exultant'], 'stems': ['elated', 'elatedly', 'elatedness', 'elatednesses']}
    )
    verb.to_dict().should.equal(
        {'functional_label': 'verb', 'headword': 'elate', 'homograph': 1, 'offensive': False, 'pronounciations': [{'audio_url': 'https://media.merriam-webster.com/audio/prons/en/US/wav/e/elate001.mp3', 'default': 'i-ˈlāt'}], 'short': ['to fill with joy or pride'], 'stems': ['elate', 'elated', 'elates', 'elating']}
    )


@with_merriam_webster_fixture("thesaurus/elated.json")
def test_adjective_verb_elated_thesaurus_definition(
    fixture: Union[dict, list]
):
    ("adjective + verb 'elated' - Thesaurus Data-modeling>")

    # Given a two definitions of "elated"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(3)

    # When I process the data model

    adjective, verb, another = definitions

    # Then their type matches
    adjective.functional_label.should.equal("adjective")
    verb.functional_label.should.equal("verb")

    adjective.to_dict().should.equal(
        {
            "functional_label": "adjective",
            "headword": "elated",
            "offensive": False,
            'short': ['experiencing or marked by overwhelming usually pleasurable emotion'],
            "stems": ["elated", "elatedly", "elatedness", "elatednesses"],
        }
    )
    verb.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "elated",
            "offensive": False,
            "stems": ["elated"],
            "status_labels": ["past tense of {d_link|elate|elate}"],
            'short': ['to fill with great joy'],
        }
    )

    another.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "elate",
            "offensive": False,

            "stems": ["elate", "elated", "elates", "elating"],
            'short': ['to fill with great joy']
        }
    )


@with_merriam_webster_fixture("thesaurus/equanimity.json")
def test_noun_equanimity_thesaurus_definition(fixture: Union[dict, list]):
    ("noun 'equanimity' - Thesaurus Data-modeling>")

    # Given a single definition of "equanimity"
    fixture.should.be.a(list)
    fixture.should.have.length_of(1)

    # When I process the data model

    item = ThesaurusDefinition(fixture[0])

    # Then it should be a noun
    item.functional_label.should.equal("noun")

    # And should not be offensive
    item.offensive.should.be.false

    # And it should have metadata
    item.meta.should.be.an(EntryMetadata)

    # And should have stems
    item.stems.should.equal(["equanimity", "equanimities"])

    item.to_dict().should.equal(
        {
            "functional_label": "noun",
            "offensive": False,
            "headword": "equanimity",
            "stems": ["equanimity", "equanimities"],
            'short': ['evenness of emotions or temper']
        }
    )


@with_merriam_webster_fixture("collegiate/kabbalah.json")
def test_noun_kaballah_collegiate_definition(fixture: Union[dict, list]):
    ("noun 'kaballah' - Collegiate Data-modeling>")

    # Given a two definitions of "kaballah"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    noun, def2 = definitions

    # Then it should be a noun
    noun.functional_label.should.equal("noun")

    # And should not be offensive
    noun.offensive.should.be.false

    # And it should have metadata
    noun.meta.should.be.an(EntryMetadata)

    # And should have stems
    noun.stems.should.equal(
        [
            "cabala",
            "cabalas",
            "cabbala",
            "cabbalah",
            "cabbalahs",
            "cabbalas",
            "kabala",
            "kabalas",
            "kabbala",
            "kabbalah",
            "kabbalahs",
            "kabbalas",
            "kabbalism",
            "kabbalisms",
            "kabbalistic",
        ]
    )


@with_merriam_webster_fixture("collegiate/kabbalah.json")
def test_noun_kaballah_collegiate_definition(fixture: Union[dict, list]):
    ("noun 'kaballah' - Collegiate Data-modeling>")

    # Given a two definitions of "kaballah"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    noun, def2 = definitions

    # Then it should be a noun
    noun.functional_label.should.equal("noun")

    # And should not be offensive
    noun.offensive.should.be.false

    # And it should have metadata
    noun.meta.should.be.an(EntryMetadata)

    # And should have stems
    noun.stems.should.equal(
        [
            "cabala",
            "cabalas",
            "cabbala",
            "cabbalah",
            "cabbalahs",
            "cabbalas",
            "kabala",
            "kabalas",
            "kabbala",
            "kabbalah",
            "kabbalahs",
            "kabbalas",
            "kabbalism",
            "kabbalisms",
            "kabbalistic",
        ]
    )

    def2.to_dict().should.equal(
        {
            "headword": "ca*ba*la",
            "offensive": False,
            "stems": [
                "cabala",
                "cabalas",
                "cabbala",
                "cabbalah",
                "cabbalahs",
                "cabbalas",
                "kabbalah",
            ],
            "variants": [{"name": "cabbala"}, {"name": "cabbalah"}],
        }
    )


@with_merriam_webster_fixture("collegiate/kabbalah.json")
def test_noun_kaballah_collegiate_definition(fixture: Union[dict, list]):
    ("noun 'kaballah' - Collegiate Data-modeling>")

    # Given a two definitions of "kaballah"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    noun, def2 = definitions

    # Then it should be a noun
    noun.functional_label.should.equal("noun")

    # And should not be offensive
    noun.offensive.should.be.false

    # And it should have metadata
    noun.meta.should.be.an(EntryMetadata)

    # And should have stems
    noun.stems.should.equal(
        [
            "cabala",
            "cabalas",
            "cabbala",
            "cabbalah",
            "cabbalahs",
            "cabbalas",
            "kabala",
            "kabalas",
            "kabbala",
            "kabbalah",
            "kabbalahs",
            "kabbalas",
            "kabbalism",
            "kabbalisms",
            "kabbalistic",
        ]
    )

    def2.to_dict().should.equal(
        {
            "headword": "ca*ba*la",
            "offensive": False,
            "stems": [
                "cabala",
                "cabalas",
                "cabbala",
                "cabbalah",
                "cabbalahs",
                "cabbalas",
                "kabbalah",
            ],
            "variants": [{"name": "cabbala"}, {"name": "cabbalah"}],
            "short": ['a medieval and modern system of Jewish theosophy, mysticism, and thaumaturgy marked by belief in creation through emanation and a cipher method of interpreting Scripture', 'a traditional, esoteric, occult, or secret matter', 'esoteric doctrine or mysterious art']
        }
    )


@with_merriam_webster_fixture("collegiate/tassel.json")
def test_noun_verb_tassel_collegiate_definition(fixture: Union[dict, list]):
    ("noun + verb 'tassel' - Collegiate Data-modeling>")

    # Given a two definitions of "tassel"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    noun, verb = definitions

    # Then their type matches
    noun.functional_label.should.equal("noun")
    verb.functional_label.should.equal("verb")

    noun.to_dict().should.equal(
        {
            "functional_label": "noun",
            "headword": "tas*sel",
            "homograph": 1,
            "offensive": False,
            "pronounciations": [
                {
                    "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/wav/t/tassel01.mp3",
                    "default": "ˈta-səl",
                },
                {"default": "ˈtä-", "label_before": "usually of corn"},
                {"default": "ˈtȯ-"},
            ],
            "stems": ["tassel", "tassels", "tiercel", "torsel"],
            "short": ['a dangling ornament made by laying parallel a bunch of cords or threads of even length and fastening them at one end', 'something resembling a tassel; especially : the terminal male inflorescence of some plants and especially corn']
        }
    )
    verb.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "tassel",
            "homograph": 2,
            "offensive": False,
            "stems": [
                "tassel",
                "tasseled",
                "tasseling",
                "tasselled",
                "tasselling",
                "tassels",
            ],
            'short': ['to adorn with tassels', 'to put forth tassel inflorescences']
        }
    )
