define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'allocation', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'apex_host',
        column: 'apex_host.name'
      }
    },
    name: {
      singular: 'allocation',
      plural: 'allocations',
      possessive: 'allocation\'s'
    },
    columnList: {
      apex_host_name: {
        column: 'apex_host.name',
        title: 'Apex Host'
      },
      scan_type_side: {
        title: 'Scan Type'
      },
      weight: {
        title: 'Weight'
      }
    },
    defaultOrder: {
      column: 'scan_type_side',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    apex_host_id: {
      title: 'Apex Host',
      type: 'enum'
    },
    scan_type_id: {
      title: 'Scan Type',
      type: 'enum'
    },
    weight: {
      title: 'Weight',
      type: 'string',
      format: 'float'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnAllocationAdd', [
    'CnAllocationModelFactory',
    function( CnAllocationModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnAllocationModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnAllocationList', [
    'CnAllocationModelFactory',
    function( CnAllocationModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnAllocationModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnAllocationView', [
    'CnAllocationModelFactory',
    function( CnAllocationModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnAllocationModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnAllocationAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnAllocationListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnAllocationViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnAllocationModelFactory', [
    'CnBaseModelFactory',
    'CnAllocationAddFactory', 'CnAllocationListFactory', 'CnAllocationViewFactory',
    'CnHttpFactory',
    function( CnBaseModelFactory,
              CnAllocationAddFactory, CnAllocationListFactory, CnAllocationViewFactory,
              CnHttpFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnAllocationAddFactory.instance( this );
        this.listModel = CnAllocationListFactory.instance( this );
        this.viewModel = CnAllocationViewFactory.instance( this, root );

        // extend getMetadata
        this.getMetadata = async function() {
          var self = this;
          await this.$$getMetadata();

          var response = await CnHttpFactory.instance( {
            path: 'apex_host',
            data: {
              select: { column: [ 'id', 'name' ] },
              modifier: { order: { name: false }, limit: 1000 }
            }
          } ).query();

          this.metadata.columnList.apex_host_id.enumList = [];
          response.data.forEach( function( item ) {
            self.metadata.columnList.apex_host_id.enumList.push( {
              value: item.id,
              name: item.name
            } );
          } );

          var response = await CnHttpFactory.instance( {
            path: 'scan_type',
            data: {
              select: { column: [ 'id', 'type', 'side' ] },
              modifier: { order: [ 'type', 'side' ], limit: 1000 }
            }
          } ).query();

          this.metadata.columnList.scan_type_id.enumList = [];
          response.data.forEach( function( item ) {
            self.metadata.columnList.scan_type_id.enumList.push( {
              value: item.id,
              name: 'none' == item.side ? item.type : item.side + ' ' + item.type
            } );
          } );
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
