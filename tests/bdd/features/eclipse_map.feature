Feature: Eclipse map display
  As an eclipse enthusiast
  I want to see solar eclipse paths on a world map
  So that I can assess whether an eclipse is visible from my location

  Background:
    Given the application is loaded

  Scenario: Viewing the eclipse list
    When I open the app
    Then I see a list of upcoming eclipses
    And each eclipse shows its date and type

  Scenario: Selecting an eclipse shows its path
    Given I open the app
    When I select the "2027-08-02" solar eclipse
    Then the map shows the eclipse path
    And the path passes over North Africa and the Middle East

  Scenario: Eclipse type badge
    Given I open the app
    When I select the "2027-08-02" solar eclipse
    Then I see the eclipse type labelled "Total"

  Scenario: Language switcher
    Given I open the app
    When I switch the language to "PL"
    Then the interface is displayed in Polish
