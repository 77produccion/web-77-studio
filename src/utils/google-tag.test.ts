import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  GA_MEASUREMENT_ID_DEFAULT,
  isProductionAnalyticsHost,
  resolveGaMeasurementId,
  shouldEmitGoogleTag,
  shouldLoadGoogleTag,
} from './google-tag.ts';

describe('google tag gate', () => {
  it('uses the production measurement ID when the env var is empty', () => {
    assert.equal(resolveGaMeasurementId(undefined), GA_MEASUREMENT_ID_DEFAULT);
    assert.equal(resolveGaMeasurementId('  '), GA_MEASUREMENT_ID_DEFAULT);
    assert.equal(resolveGaMeasurementId('G-CUSTOM'), 'G-CUSTOM');
  });

  it('accepts only the public production hostnames', () => {
    assert.equal(isProductionAnalyticsHost('www.77studio.co'), true);
    assert.equal(isProductionAnalyticsHost('77studio.co'), true);
    assert.equal(isProductionAnalyticsHost('127.0.0.1'), false);
    assert.equal(isProductionAnalyticsHost('localhost'), false);
    assert.equal(isProductionAnalyticsHost('web-77-studio.vercel.app'), false);
  });

  it('emits the tag only for a production build outside Vercel preview', () => {
    const id = GA_MEASUREMENT_ID_DEFAULT;
    assert.equal(shouldEmitGoogleTag({ prod: false, measurementId: id }), false);
    assert.equal(
      shouldEmitGoogleTag({ prod: true, vercelEnv: 'preview', measurementId: id }),
      false,
    );
    assert.equal(
      shouldEmitGoogleTag({ prod: true, vercelEnv: 'development', measurementId: id }),
      false,
    );
    assert.equal(shouldEmitGoogleTag({ prod: true, measurementId: id }), true);
    assert.equal(
      shouldEmitGoogleTag({ prod: true, vercelEnv: 'production', measurementId: id }),
      true,
    );
  });

  it('loads gtag only when the build is production and the host is public', () => {
    const id = GA_MEASUREMENT_ID_DEFAULT;
    assert.equal(
      shouldLoadGoogleTag({ prod: false, hostname: 'www.77studio.co', measurementId: id }),
      false,
    );
    assert.equal(
      shouldLoadGoogleTag({ prod: true, hostname: '127.0.0.1', measurementId: id }),
      false,
    );
    assert.equal(
      shouldLoadGoogleTag({ prod: true, hostname: 'localhost', measurementId: id }),
      false,
    );
    assert.equal(
      shouldLoadGoogleTag({
        prod: true,
        vercelEnv: 'preview',
        hostname: 'www.77studio.co',
        measurementId: id,
      }),
      false,
    );
    assert.equal(
      shouldLoadGoogleTag({
        prod: true,
        vercelEnv: 'production',
        hostname: 'www.77studio.co',
        measurementId: id,
      }),
      true,
    );
    assert.equal(
      shouldLoadGoogleTag({
        prod: true,
        vercelEnv: 'production',
        hostname: '77studio.co',
        measurementId: id,
      }),
      true,
    );
  });
});
