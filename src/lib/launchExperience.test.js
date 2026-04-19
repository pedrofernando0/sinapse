import {
  getLaunchDestination,
  getLaunchExperience,
  normalizeLaunchProfile,
} from './launchExperience.js';

describe('launchExperience', () => {
  it('normalizes unknown profiles to aluno', () => {
    expect(normalizeLaunchProfile('qualquer')).toBe('aluno');
  });

  it('returns the teacher shell route for professor', () => {
    expect(getLaunchDestination('professor')).toBe('/professor');
  });

  it('falls back to the generic experience when the profile is not mapped', () => {
    expect(getLaunchExperience('desconhecido').shellLabel).toBe('Plataforma');
  });
});
