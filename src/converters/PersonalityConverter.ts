import { Context } from '@/contexts/Context';
import { PersonalityTone } from '@/i18n/context/types';

import { BaseConverter, ConversionError } from './BaseConverter';

export class PersonalityToneConverter extends BaseConverter<PersonalityTone> {
    readonly name = 'PersonalityTone';

    private readonly validTones: PersonalityTone[] = [
        'casual',
        'chaotic',
        'formal',
        'neutral',
        'robotic',
        'silly',
    ];

    async convert(ctx: Context, value: string): Promise<PersonalityTone> {
        this.validateInput(value);

        const normalized = value.toLowerCase() as PersonalityTone;

        if (this.validTones.includes(normalized)) {
            return normalized;
        }

        throw new ConversionError('error-conversion-invalid-personality-tone', {
            input: value,
            validOptions: this.validTones.join(', '),
        });
    }
}
