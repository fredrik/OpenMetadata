/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { interceptURL, verifyResponseStatusCode } from '../../common/common';
import { GlobalSettingOptions } from '../../constants/settings.constant';

const config = {
  logo: 'https://custom-logo.png',
  monogram: 'https://custom-monogram.png',
  logoError: 'Logo URL is not valid url',
  monogramError: 'Monogram URL is not valid url',
};

describe('Custom Logo Config', { tags: 'Settings' }, () => {
  beforeEach(() => {
    cy.login();

    cy.settingClick(GlobalSettingOptions.APPEARANCE);
  });

  it('Should update the config', () => {
    cy.get('[data-testid="customLogoUrlPath"]')
      .scrollIntoView()
      .clear()
      .type('incorrect url');

    // validation should work
    cy.get('[role="alert"]').should('contain', config.logoError);

    cy.get('[data-testid="customLogoUrlPath"]')
      .scrollIntoView()
      .clear()
      .type(config.logo);

    cy.get('[data-testid="customMonogramUrlPath"]')
      .scrollIntoView()
      .clear()
      .type('incorrect url');

    // validation should work
    cy.get('[role="alert"]').should('contain', config.monogramError);

    cy.get('[data-testid="customMonogramUrlPath"]')
      .scrollIntoView()
      .clear()
      .type(config.monogram);

    interceptURL('PUT', 'api/v1/system/settings', 'updatedConfig');

    cy.get('[data-testid="save-btn"]').scrollIntoView().click();

    verifyResponseStatusCode('@updatedConfig', 200);
  });

  it('Reset to default', () => {
    interceptURL('PUT', 'api/v1/system/settings', 'updatedConfig');

    cy.get('[data-testid="reset-button"]').click();

    verifyResponseStatusCode('@updatedConfig', 200);
  });
});
