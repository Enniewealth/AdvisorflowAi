from django.core.management.base import BaseCommand

from education.models import EducationContent


SEED_CONTENT = [
    (
        "What insurance does",
        "english",
        "insurance_basics",
        "Insurance helps a person or business transfer financial risk to an insurer. The client pays a premium so covered losses can be paid according to the policy terms.",
    ),
    (
        "Bawo ni insurance se n ṣiṣẹ",
        "yoruba",
        "insurance_basics",
        "Insurance n ran eniyan tabi ile ise lọwọ lati dinku ewu owo. Onibara san premium, ile insurance si le san iranwọ ti ohun ti policy bo ba sele.",
    ),
    (
        "Yadda insurance yake aiki",
        "hausa",
        "insurance_basics",
        "Insurance yana taimakawa mutum ko kasuwanci rage hadarin asarar kudi. Abokin ciniki yana biyan premium domin a biya shi idan abin da policy ta rufe ya faru.",
    ),
    (
        "Kedu ka insurance si aru oru",
        "igbo",
        "insurance_basics",
        "Insurance na-enyere mmadu ma obu ulo oru aka ibelata ihe egwu ego. Onye ahịa na-akwụ premium ka insurer nyere aka ma ihe policy kpuchiri mee.",
    ),
    (
        "Understanding policy expiry",
        "english",
        "policy_explanations",
        "A policy expiry date is the last day the current cover remains active. Advisors should contact clients before this date so renewal can be completed without a coverage gap.",
    ),
    (
        "Ojo ti policy pari",
        "yoruba",
        "policy_explanations",
        "Ojo expiry ni ojo ikeyin ti aabo policy ṣi n ṣiṣẹ. Advisor yẹ ki o kan si onibara ki renewal le waye ki aabo ma ba da duro.",
    ),
    (
        "Ranar karewar policy",
        "hausa",
        "policy_explanations",
        "Ranar expiry ita ce rana ta karshe da policy ke aiki. Ya kamata advisor ya tuntubi abokin ciniki kafin ranar domin sabuntawa ta gudana ba tare da gibi ba.",
    ),
    (
        "Ubochi policy na-agwu",
        "igbo",
        "policy_explanations",
        "Ubochi expiry bu ubochi ikpeazu policy na-arụ ọrụ. Advisor kwesiri ikwu okwu na onye ahịa tupu ubochi a ka renewal ghara igbu oge.",
    ),
    (
        "Claims preparation",
        "english",
        "claims_guidance",
        "Clients should keep policy documents, receipts, photos, police reports where applicable, and clear incident notes. This content is educational and not a claims service.",
    ),
    (
        "Igbaradi fun claim",
        "yoruba",
        "claims_guidance",
        "Onibara yẹ ki o pa iwe policy, receipt, aworan, iroyin olopa ti o ba wulo, ati alaye iṣẹlẹ mọ. Eyi je eko nikan, kii se iṣẹ claims.",
    ),
    (
        "Shirye-shiryen claim",
        "hausa",
        "claims_guidance",
        "Abokan ciniki su adana takardun policy, rasit, hotuna, rahoton yan sanda idan ya dace, da bayanin abin da ya faru. Wannan ilimi ne kawai, ba sabis na claims ba.",
    ),
    (
        "Nkwadebe claim",
        "igbo",
        "claims_guidance",
        "Ndị ahịa kwesiri ichekwa akwụkwọ policy, receipts, foto, police report ma o buru na odi mkpa, na nkọwa ihe mere. Nke a bu nkuzi, obughi claims service.",
    ),
    (
        "Premium",
        "english",
        "terminology",
        "Premium is the amount a client pays to keep insurance cover active for a stated period.",
    ),
    (
        "Premium",
        "yoruba",
        "terminology",
        "Premium ni owo ti onibara san lati je ki aabo insurance maa ṣiṣẹ fun akoko kan.",
    ),
    (
        "Premium",
        "hausa",
        "terminology",
        "Premium shi ne kudin da abokin ciniki yake biya domin insurance ya ci gaba da aiki na wani lokaci.",
    ),
    (
        "Premium",
        "igbo",
        "terminology",
        "Premium bu ego onye ahịa na-akwụ iji mee ka insurance cover na-arụ ọrụ ruo oge akọwapụtara.",
    ),
]


class Command(BaseCommand):
    help = "Seed intentional insurance education content in English, Yoruba, Hausa, and Igbo."

    def handle(self, *args, **options):
        created = 0
        for title, language, category, content in SEED_CONTENT:
            _, was_created = EducationContent.objects.update_or_create(
                title=title,
                language=language,
                category=category,
                defaults={"content": content, "is_published": True},
            )
            created += int(was_created)
        self.stdout.write(self.style.SUCCESS(f"Seeded education content. Created {created} new item(s)."))
