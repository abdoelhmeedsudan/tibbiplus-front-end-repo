import { BehaviorSubject } from "rxjs";
import { Menu } from "../interface/menu";

export const menuItems: Menu[] = [
  {
    main_title: 'General'
  },
  {
    title: 'Dashboards',
    id: 'dashboards',
    icon: 'home',
    type: 'sub',
    active: true,
    level: 1,
    badge: true,
    badge_value: "1",
    badge_color: 'primary',
    children: [
      { path: '/dashboard/default', title: 'default', type: 'link' },
    ],
  },
  {
    title: 'Widgets',
    id: 'widgets',
    icon: 'widget',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      { path: '/widgets/general', title: 'General', type: 'link', id: 'general-widgets' },
    ],
  },
  {
    main_title: "Applications"
  },
  
  {
    title: 'Basic Data',
    id: 'lookups',
    icon: 'database',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      { path: '/lookups/countries', title: 'Countries', type: 'link' },
      { path: '/lookups/cities', title: 'Cities', type: 'link' },
      { path: '/lookups/job-titles', title: 'Job Titles', type: 'link' },
      { path: '/lookups/nationalities', title: 'Nationalities', type: 'link' },
      { path: '/lookups/specializations', title: 'Specializations', type: 'link' },
      { path: '/lookups/sub-specializations', title: 'Sub Specializations', type: 'link' },
    ],
  },
  {
    main_title: "Forms & Table"
  },
  {
    title: 'Forms',
    id: 'forms',
    icon: 'form',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      {
        title: 'Form Controls',
        id: 'form-controls',
        type: 'sub',
        active: false,
        level: 2,
        children: [
          {
            path: '/forms/form-control/form-validation',
            title: 'Form Validation',
            type: 'link',
          },
          {
            path: '/forms/form-control/base-input',
            title: 'Base Input',
            type: 'link',
          },
          {
            path: '/forms/form-control/checkbox-radio',
            title: 'Checkbox & Radio',
            type: 'link',
          },
          {
            path: '/forms/form-control/input-groups',
            title: 'Input Groups',
            type: 'link',
          },
          {
            path: '/forms/form-control/input-mask',
            title: 'Input Mask',
            type: 'link',
          },
          {
            path: '/forms/form-control/mega-options',
            title: 'Mega Options',
            type: 'link',
          },
        ],
      },
      {
        title: 'Form Widgets',
        id: 'form-widgets',
        type: 'sub',
        active: false,
        level: 2,
        children: [
          {
            path: '/forms/form-widgets/datepicker',
            title: 'Datepicker',
            type: 'link',
          },
          {
            path: '/forms/form-widgets/touchspin',
            title: 'Touchspin',
            type: 'link',
          },
          { path: '/forms/form-widgets/select2', title: 'Select2', type: 'link' },
          { path: '/forms/form-widgets/switch', title: 'Switch', type: 'link' },
          {
            path: '/forms/form-widgets/type-a-head',
            title: 'Typeahead',
            type: 'link',
          },
          {
            path: '/forms/form-widgets/clipboard',
            title: 'Clipboard',
            type: 'link',
          },
        ],
      },
      {
        title: 'Form Layout',
        id: 'form-layout',
        type: 'sub',
        active: false,
        level: 2,
        children: [
          {
            path: '/forms/form-layout/form-wizard',
            title: 'Form Wizard 1',
            type: 'link',
          },
          {
            path: '/forms/form-layout/form-wizard-two',
            title: 'Form Wizard 2',
            type: 'link',
          },
          {
            path: '/forms/form-layout/two-factor',
            title: 'Two Factor',
            type: 'link',
          },
        ],
      }
    ]
  },
  {
    title: 'Tables',
    id: 'tables',
    icon: 'table',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      {
        title: 'Bootstrap Tables',
        id: 'bootstrap-tables',
        type: 'sub',
        active: false,
        level: 2,
        children: [
          {
            path: '/table/bootstrap-tables/basic-tables',
            title: 'Basic Tables',
            type: 'link',
          },
          {
            path: '/table/bootstrap-tables/table-components',
            title: 'Table Components',
            type: 'link',
          },
        ],
      },
      {
        title: 'Data Table',
        id: 'data-tables',
        path: '/table/data-table',
        type: 'link',
        level: 2,
      },
    ]
  },
  {
    main_title: 'Components'
  },
  {
    title: 'UI Kits',
    id: 'ui-kits',
    icon: 'ui-kits',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      { path: '/ui-kits/typography', title: 'Typography', type: 'link' },
      { path: '/ui-kits/avatars', title: 'Avatars', type: 'link' },
      { path: '/ui-kits/divider', title: 'Divider', type: 'link', badge: true, badge_color: 'success', badge_value: "New" },
      { path: '/ui-kits/helper-classes', title: 'Helper Classes', type: 'link', },
      { path: '/ui-kits/grid', title: 'Grid', type: 'link' },
      { path: '/ui-kits/tag-pills', title: 'Tag & Pills', type: 'link' },
      { path: '/ui-kits/progress', title: 'Progress', type: 'link' },
      { path: '/ui-kits/modal', title: 'Modal', type: 'link' },
      { path: '/ui-kits/alert', title: 'Alert', type: 'link' },
      { path: '/ui-kits/popover', title: 'Popover', type: 'link' },
      { path: '/ui-kits/placeholders', title: 'Placeholders', type: 'link', badge: true, badge_color: 'success', badge_value: "New" },
      { path: '/ui-kits/tooltip', title: 'Tooltip', type: 'link' },
      { path: '/ui-kits/dropdown', title: 'Dropdown', type: 'link' },
      { path: '/ui-kits/accordion', title: 'Accordion', type: 'link' },
      { path: '/ui-kits/tabs', title: 'Tabs', type: 'link' },
      { path: '/ui-kits/offcanvas', title: 'Offcanvas', type: 'link', badge: true, badge_color: 'success', badge_value: "New" },
      { path: '/ui-kits/navigate-links', title: 'Navigate Links', type: 'link', badge: true, badge_color: 'success', badge_value: "New" },
      { path: '/ui-kits/lists', title: 'Lists', type: 'link' },
    ],
  },
  {
    title: 'Animations',
    id: 'animations',
    icon: 'animation',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      { path: '/animation/animate', title: 'Animate', type: 'link' },
    ],
  },
  {
    title: 'Icons',
    id: 'isonc',
    icon: 'icons',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      { path: '/icon/flag-icon', title: 'Flag Icon', type: 'link' },
      { path: '/icon/font-awesome-icon', title: 'Fontawesome Icon', type: 'link', },
      { path: '/icon/ico-icon', title: 'Ico Icon', type: 'link' },
      { path: '/icon/thimify-icon', title: 'Themify Icon', type: 'link' },
      { path: '/icon/feather-icon', title: 'Feather Icon', type: 'link' },
      { path: '/icon/weather-icon', title: 'Weather Icon', type: 'link' },
    ],
  },
  {
    title: 'Buttons',
    id: 'buttons',
    icon: 'button',
    type: 'link',
    path: '/button',
    level: 1,
  },
  {
    main_title: 'Pages'
  },
  {
    path: '/internationalization',
    id: 'internationalization',
    title: 'Internationalization',
    icon: 'internationalization',
    type: 'link',
    level: 1,
  },
  {
    title: 'Error Pages',
    id: 'error-pages',
    icon: 'error',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      {
        path: '/error/403',
        title: 'Error 403',
        type: 'link',
      },
      {
        path: '/error/404',
        title: 'Error 404',
        type: 'link',
      },
      {
        path: '/error/500',
        title: 'Error 500',
        type: 'link',
      },
    ],
  },
  {
    title: 'Authentication',
    id: 'authentication',
    icon: 'authenticate',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      {
        path: '/auth/login-simple',
        title: 'Login Simple',
        type: 'link',
      },
      {
        path: '/auth/login-bg-image',
        title: 'Login with Bg image',
        type: 'link',
      },
      {
        path: '/auth/login-bg-image-two',
        title: 'Login with Image two',
        type: 'link',
      },
      {
        path: '/auth/login-bg-image-three',
        title: 'Login with Image Three',
        type: 'link',
      },
      {
        path: '/auth/login-tooltip',
        title: 'Login with Tooltip',
        type: 'link',
      },
      {
        path: '/auth/login-sweet-alert',
        title: 'Login with Sweetalert',
        type: 'link',
      },
      {
        path: '/auth/register',
        title: 'Register Simple',
        type: 'link',
      },
      {
        path: '/auth/register-bg-image',
        title: 'Register with Bg image',
        type: 'link',
      },
      {
        path: '/auth/register-bg-image-two',
        title: 'Register with Image two',
        type: 'link',
      },
      {
        path: '/auth/register-bg-image-three',
        title: 'Register with Image Three',
        type: 'link',
      },
      {
        path: '/auth/register-tooltip',
        title: 'Register with Tooltip',
        type: 'link',
      },
      {
        path: '/auth/register-sweet-alert',
        title: 'Register with Sweetalert',
        type: 'link',
      },
      {
        path: '/auth/unlock-user',
        title: 'Unlock User',
        type: 'link',
      },
      {
        path: '/auth/forget-password',
        title: 'Forget Password',
        type: 'link',
      },
      {
        path: '/auth/reset-password',
        title: 'Reset Password',
        type: 'link',
      },
      {
        path: '/auth/maintenance',
        title: 'Maintenance',
        type: 'link',
      },
    ],
  },
  {
    title: 'Coming Soon',
    id: 'coming-soon',
    icon: 'coming-soon',
    type: 'sub',
    active: false,
    level: 1,
    children: [
      {
        path: '/coming-soon/simple',
        title: 'Coming Simple',
        type: 'link',
      },
      {
        path: '/coming-soon/simple-with-bg-img',
        title: 'Coming with Bg image',
        type: 'link',
      },
      {
        path: '/coming-soon/simple-with-bg-vid',
        title: 'Coming with Bg video',
        type: 'link',
      },
    ],
  },
];

export const items = new BehaviorSubject<Menu[]>(menuItems);
