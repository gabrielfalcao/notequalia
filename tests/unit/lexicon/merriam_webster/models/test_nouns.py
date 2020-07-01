from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, ThesaurusDefinition, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture('thesaurus/equanimity.json')
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
    item.stems.should.equal(['equanimity', 'equanimities'])

    item.to_dict().should.equal({
        'functional_label': 'noun',
        'offensive': False,
        'headword': 'equanimity',
        'stems': ['equanimity', 'equanimities'],
        'homograph': None,
        'variants': [],
    })


@with_merriam_webster_fixture('collegiate/kabbalah.json')
def test_noun_kaballah_collegiate_definition(fixture: Union[dict, list]):
    ("noun 'kaballah' - Collegiate Data-modeling>")

    # Given a two definitions of "kaballah"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    def1, def2 = definitions


    # Then it should be a noun
    def1.functional_label.should.equal("noun")

    # And should not be offensive
    def1.offensive.should.be.false

    # And it should have metadata
    def1.meta.should.be.an(EntryMetadata)

    # And should have stems
    def1.stems.should.equal(['cabala', 'cabalas', 'cabbala', 'cabbalah', 'cabbalahs', 'cabbalas', 'kabala', 'kabalas', 'kabbala', 'kabbalah', 'kabbalahs', 'kabbalas', 'kabbalism', 'kabbalisms', 'kabbalistic'])

    def1.to_dict().should.equal({'functional_label': 'noun', 'headword': 'kab*ba*lah', 'homograph': None, 'offensive': False, 'stems': ['cabala', 'cabalas', 'cabbala', 'cabbalah', 'cabbalahs', 'cabbalas', 'kabala', 'kabalas', 'kabbala', 'kabbalah', 'kabbalahs', 'kabbalas', 'kabbalism', 'kabbalisms', 'kabbalistic'], 'variants': [{'name': 'kab*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'ka*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'ca*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'cab*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'cab*ba*lah', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}]})
    def2.to_dict().should.equal({'functional_label': None, 'headword': 'ca*ba*la', 'homograph': None, 'offensive': False, 'stems': ['cabala', 'cabalas', 'cabbala', 'cabbalah', 'cabbalahs', 'cabbalas', 'kabbalah'], 'variants': [{'name': 'cabbala', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'cabbalah', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}]})


@with_merriam_webster_fixture('collegiate/kabbalah.json')
def test_noun_kaballah_collegiate_definition(fixture: Union[dict, list]):
    ("noun 'kaballah' - Collegiate Data-modeling>")

    # Given a two definitions of "kaballah"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    def1, def2 = definitions


    # Then it should be a noun
    def1.functional_label.should.equal("noun")

    # And should not be offensive
    def1.offensive.should.be.false

    # And it should have metadata
    def1.meta.should.be.an(EntryMetadata)

    # And should have stems
    def1.stems.should.equal(['cabala', 'cabalas', 'cabbala', 'cabbalah', 'cabbalahs', 'cabbalas', 'kabala', 'kabalas', 'kabbala', 'kabbalah', 'kabbalahs', 'kabbalas', 'kabbalism', 'kabbalisms', 'kabbalistic'])

    def1.to_dict().should.equal({'functional_label': 'noun', 'headword': 'kab*ba*lah', 'homograph': None, 'offensive': False, 'stems': ['cabala', 'cabalas', 'cabbala', 'cabbalah', 'cabbalahs', 'cabbalas', 'kabala', 'kabalas', 'kabbala', 'kabbalah', 'kabbalahs', 'kabbalas', 'kabbalism', 'kabbalisms', 'kabbalistic'], 'variants': [{'name': 'kab*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'ka*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'ca*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'cab*ba*la', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'cab*ba*lah', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}]})
    def2.to_dict().should.equal({'functional_label': None, 'headword': 'ca*ba*la', 'homograph': None, 'offensive': False, 'stems': ['cabala', 'cabalas', 'cabbala', 'cabbalah', 'cabbalahs', 'cabbalas', 'kabbalah'], 'variants': [{'name': 'cabbala', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}, {'name': 'cabbalah', 'pronounciations': [], 'sense_specific_inflection_plural_label': None}]})
