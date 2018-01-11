define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'scan_type', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: { column: [ 'type', 'side' ] },
    name: {
      singular: 'scan type',
      plural: 'scan types',
      possessive: 'scan type\'s',
      pluralPossessive: 'scan types\''
    },
    columnList: {
      type: {
        title: 'Type'
      },
      side: {
        title: 'Side'
      },
      apex_scan_count: {
        title: 'Apex Scans',
        type: 'number'
      },
      participant_count: {
        title: 'Participants',
        type: 'number'
      }
    },
    defaultOrder: {
      column: 'scan_type.type',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    type: {
      title: 'Type',
      type: 'string'
    },
    side: {
      title: 'Side',
      type: 'string'
    },
    apex_scan_count: {
      title: 'Apex Scans',
      type: 'string',
      constant: true
    },
    participant_count: {
      title: 'Participants',
      type: 'string',
      constant: true
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnScanTypeAdd', [
    'CnScanTypeModelFactory',
    function( CnScanTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnScanTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnScanTypeList', [
    'CnScanTypeModelFactory',
    function( CnScanTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnScanTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnScanTypeView', [
    'CnScanTypeModelFactory',
    function( CnScanTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnScanTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnScanTypeAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnScanTypeListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnScanTypeViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnScanTypeModelFactory', [
    'CnBaseModelFactory',
    'CnScanTypeAddFactory', 'CnScanTypeListFactory', 'CnScanTypeViewFactory',
    function( CnBaseModelFactory,
              CnScanTypeAddFactory, CnScanTypeListFactory, CnScanTypeViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnScanTypeAddFactory.instance( this );
        this.listModel = CnScanTypeListFactory.instance( this );
        this.viewModel = CnScanTypeViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );