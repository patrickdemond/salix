define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'code_type', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {},
    name: {
      singular: 'code type',
      plural: 'code types',
      possessive: 'code type\'s'
    },
    columnList: {
      code: {
        title: 'Code'
      },
      apex_deployment_count: {
        title: 'Apex Deployments',
        type: 'number'
      },
      scan_type_count: {
        title: 'Scan Types',
        type: 'number'
      },
      description: {
        title: 'Description'
      }
    },
    defaultOrder: {
      column: 'code_type.code',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    code: {
      title: 'Code',
      type: 'string'
    },
    description: {
      title: 'Description',
      type: 'text'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnCodeTypeAdd', [
    'CnCodeTypeModelFactory',
    function( CnCodeTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnCodeTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnCodeTypeList', [
    'CnCodeTypeModelFactory',
    function( CnCodeTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnCodeTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnCodeTypeView', [
    'CnCodeTypeModelFactory',
    function( CnCodeTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnCodeTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCodeTypeAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCodeTypeListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCodeTypeViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCodeTypeModelFactory', [
    'CnBaseModelFactory',
    'CnCodeTypeAddFactory', 'CnCodeTypeListFactory', 'CnCodeTypeViewFactory',
    function( CnBaseModelFactory,
              CnCodeTypeAddFactory, CnCodeTypeListFactory, CnCodeTypeViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnCodeTypeAddFactory.instance( this );
        this.listModel = CnCodeTypeListFactory.instance( this );
        this.viewModel = CnCodeTypeViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
