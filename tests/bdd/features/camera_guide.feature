Feature: Photography exposure guide
  As an eclipse photographer
  I want to receive appropriate camera settings for each eclipse phase
  So that I can capture the eclipse correctly without damaging my equipment

  Background:
    Given the application is loaded
    And I select the "2027-08-02" solar eclipse
    And I choose the location "Luxor" at 25.69°N 32.64°E

  Scenario: Solar filter warning during partial phases
    When I view the camera guide for the partial phase
    Then I see a warning that a solar filter is required
    And I see recommended ISO and shutter speed settings

  Scenario: No-filter instruction during totality
    When I view the camera guide for the totality phase
    Then I do not see a solar filter warning
    And I see recommended exposure settings for the inner corona
    And I see recommended exposure settings for the outer corona

  Scenario: Phase timeline is displayed
    When I view the eclipse details
    Then I see the phase timeline from C1 to C4
    And each contact time is labelled

  Scenario: Camera settings change with phase
    When I view the camera guide for the partial phase
    Then the recommended settings differ from those for totality
