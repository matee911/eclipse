Feature: Local eclipse circumstances
  As an observer or photographer
  I want to know what the eclipse will look like from my location
  So that I can plan my observation and photography

  Background:
    Given the application is loaded

  Scenario: Observer inside totality path sees full details
    Given I select the "2027-08-02" solar eclipse
    And I choose the location "Luxor" at 25.69°N 32.64°E
    Then I see "In path of totality" status
    And I see a totality duration greater than 0 seconds
    And I see contact times C1, C2, maximum, C3, C4

  Scenario: Observer outside path sees partial eclipse
    Given I select the "2027-08-02" solar eclipse
    And I choose the location "Cairo" at 30.06°N 31.25°E
    Then I see "Partial eclipse" status
    And I see an obscuration percentage between 1% and 99%
    And I do not see C2 and C3 contact times

  Scenario: Sun altitude is shown at maximum eclipse
    Given I select the "2027-08-02" solar eclipse
    And I choose the location "Luxor" at 25.69°N 32.64°E
    Then I see the Sun altitude at maximum eclipse
    And the altitude is greater than 70 degrees

  Scenario: Sky darkening indicator for totality
    Given I select the "2027-08-02" solar eclipse
    And I choose the location "Luxor" at 25.69°N 32.64°E
    Then I see the sky darkening indicator
    And the sky condition is described as "Night-like"

  Scenario: Observer outside any eclipse zone
    Given I select the "2027-08-02" solar eclipse
    And I choose the location "Sydney" at 33.87°S 151.21°E
    Then I see "Not visible" or "Outside eclipse zone" status
