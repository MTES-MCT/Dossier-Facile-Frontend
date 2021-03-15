import { CollapseElement, CollapseGroup } from "@gouvfr/utilities/src/scripts/";

const ACCORDION_GROUP = ".rf-accordion-group";
const ACCORDION_COLLAPSE = ".rf-accordion__body";
const ACCORDION_BODY = "rf-accordion__body";
const EXPANDED = "--expanded";

class Accordion {
  constructor() {
    this.init();
  }

  init() {
    const accordionGroups = document.querySelectorAll(ACCORDION_GROUP);
    const elements = document.querySelectorAll(ACCORDION_COLLAPSE);
    let element, collapseElement, collapseGroup;

    this.collapseGroupsElements = [];
    this.collapseGroupElements = [];
    this.collapseGroupsArray = [];

    // Get accordions groups, set data attribute and create collapse group to each
    for (let i = 0; i < accordionGroups.length; i++) {
      accordionGroups[i].setAttribute("data-rf-ac", "rf-ac-group-" + i);
      this.collapseGroupsElements.push(accordionGroups[i]);
      collapseGroup = new CollapseGroup();
      this.collapseGroupsArray.push(collapseGroup);
    }

    // Get collapsible elements in groups
    for (let i = 0; i < this.collapseGroupsElements.length; i++) {
      for (const element of this.collapseGroupsElements[i].querySelectorAll(
        ACCORDION_COLLAPSE
      )) {
        this.collapseGroupElements.push(element);
      }
    }

    // Get accordion elements in groups only and create new set
    const elementsGroupOnly = new Set(this.collapseGroupElements);

    // Get accordion elements and create new array with accordion elements that are not in groups
    const elementsSingleOnly = [
      ...new Set([...elements].filter(x => !elementsGroupOnly.has(x)))
    ];

    // Single accordion element(s) collapse individually
    for (let i = 0; i < elementsSingleOnly.length; i++) {
      element = elementsSingleOnly[i];
      collapseElement = new CollapseElement(element, ACCORDION_BODY + EXPANDED);
    }

    // Grouped accordion elements collapse
    for (let i = 0; i < this.collapseGroupElements.length; i++) {
      element = this.collapseGroupElements[i];
      const groupAttr = element.closest(".rf-accordion-group").dataset.rfAc;
      element.setAttribute("data-rf-ac", groupAttr);
      collapseElement = new CollapseElement(element, ACCORDION_BODY + EXPANDED);
      this.collapseGroupsArray[element.dataset.rfAc.slice(-1)].add(
        collapseElement
      );
    }
  }
}

export { Accordion };
